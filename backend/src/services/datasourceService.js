const fs = require('fs');
const dataSourceRepository = require('../repository/datasourceRepository');
const dashboardDatasourceMapRepository = require('../repository/dashboardDatasourceMapRepository');
const dataSourceMetadataRepository = require('../repository/datasourceMetadataRepository');
const modelCreator = require('../utils/modelCreator');
const dbUtils = require('../utils/dbUtils');
const { parseExpression } = require('../utils/expressionParser');

const ColumnsNotFoundException = require('../exceptions/ColumnsNotFoundException');
const DatasourceNotFoundException = require('../exceptions/DatasourceNotFoundException');
const InvalidInputException = require('../exceptions/InvalidInputException');
const { findCustomColumn } = require('../repository/datasourceMetadataRepository');
const { validateColumnName } = require('../utils/csvParser');
const { validateExpression } = require('../utils/expressionParser');
const { EXTENDED_JSON_TYPES } = require('../constants/fileTypes');
const { fileTypes } = require('../constants/fileTypes');
const { dbDataTypes } = require('../constants/dbConstants');
const { invalidExpression, invalidColumnName } = require('../exceptions/errors');

const FILE_UPLOAD_PATH = './uploads/';

function isNotProvidedDataHaveEqualColumns(data, columns) {
  return columns.length !== Object.keys(data).length;
}

async function getDataSourceModel(datasourceId) {
  const { dataSourceSchema } = await dataSourceMetadataRepository.getDataSourceSchemaById(
    datasourceId,
  );
  return modelCreator.getOrCreateModel(datasourceId, dataSourceSchema);
}

async function getNewDataSourceModel(datasourceId, newSchema) {
  modelCreator.deleteModel(datasourceId);
  return modelCreator.getOrCreateModel(datasourceId, newSchema);
}

async function getData(datasourceId, columns, aggregationParams, limit = 0) {
  const uniqueColumns = [...new Set(columns)];
  const datasourceMetadata =
    await dataSourceMetadataRepository.getDatasourceMetadataForDatasourceId(datasourceId);
  if (!datasourceMetadata) {
    throw new DatasourceNotFoundException(datasourceId);
  }
  if (datasourceMetadata.fileType === fileTypes.GEOJSON) {
    return getGeojsonData(datasourceMetadata, aggregationParams);
  }
  if (
    datasourceMetadata.fileType === fileTypes.JSON ||
    EXTENDED_JSON_TYPES.includes(datasourceMetadata.fileType)
  ) {
    return getJsonData(datasourceMetadata);
  }
  if (datasourceMetadata.fileType === fileTypes.CSV) {
    return getCsvData(datasourceId, uniqueColumns, aggregationParams, limit);
  }
  throw new DatasourceNotFoundException(datasourceMetadata.fileId);
}

function getGeojsonData(datasourceMetadata, aggregationParams) {
  const filePath = `${FILE_UPLOAD_PATH}${datasourceMetadata.fileId}`;
  if (!fs.existsSync(filePath)) {
    throw new DatasourceNotFoundException(datasourceMetadata.fileId);
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  const parsedData = JSON.parse(data);
  if (!aggregationParams) {
    return { data: parsedData };
  }
  const {
    filter: { propertyKey, value },
  } = aggregationParams;
  const { features } = parsedData;

  parsedData.features = features.filter((feature) => feature.properties[propertyKey] === value);
  return { data: parsedData };
}

function getJsonData(datasourceMetadata) {
  const filePath = `${FILE_UPLOAD_PATH}${datasourceMetadata.fileId}`;
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return { data: JSON.parse(data) };
  }
  throw new DatasourceNotFoundException(datasourceMetadata.fileId);
}

async function getCsvData(datasourceId, columns, aggregationParams, limit) {
  const dataSourceModel = await getDataSourceModel(datasourceId);
  const columnsMap = dbUtils.getProjectedColumns([...columns]);
  let allColumns = columns;
  const dataRecords = await getDataRecord(aggregationParams, dataSourceModel, columnsMap, limit);
  if (aggregationParams) {
    allColumns = [
      ...new Set([...aggregationParams.groupBy, ...Object.keys(aggregationParams.aggregate)]),
    ];
  }

  const data = dbUtils.changeRecordDimensionToArray(dataRecords);
  if (allColumns.length > 0 && isNotProvidedDataHaveEqualColumns(data, allColumns)) {
    throw new ColumnsNotFoundException();
  }

  return { data };
}

async function getDataRecord(aggregationParams, dataSourceModel, columnsMap, limit) {
  if (aggregationParams) {
    return dataSourceRepository.getAggregatedData(dataSourceModel, aggregationParams, limit);
  }
  return dataSourceRepository.getData(dataSourceModel, columnsMap, limit);
}

async function deleteCsvFiles(datasourceIds) {
  const csvDatasourcesMetadata = await dataSourceMetadataRepository.filterDatasourceIds(
    datasourceIds,
    { fileType: 'csv' },
  );
  const csvMetadataIds = csvDatasourcesMetadata.map(({ _id }) => _id.toString());
  return dataSourceRepository.bulkDeleteCsv(csvMetadataIds);
}

function deleteJsonFileFromFileSystem(fileId) {
  if (fs.existsSync(`${FILE_UPLOAD_PATH}${fileId}`)) {
    fs.rmSync(`${FILE_UPLOAD_PATH}${fileId}`);
  }
}

async function deleteJsonFiles(datasourceIds) {
  const datasourcesMetadata = await dataSourceMetadataRepository.filterDatasourceIds(
    datasourceIds,
    { fileType: { $in: ['json', ...EXTENDED_JSON_TYPES] } },
  );
  datasourcesMetadata.forEach(({ fileId }) => {
    deleteJsonFileFromFileSystem(fileId);
  });
}

async function bulkDeleteDatasource(datasourceIds) {
  await Promise.all([deleteCsvFiles(datasourceIds), deleteJsonFiles(datasourceIds)]);
  await dataSourceMetadataRepository.bulkDeleteDatasourceMetadata(datasourceIds);
  return { deletedCount: datasourceIds.length };
}

async function deleteDatasource(id) {
  const datasourceMetadata =
    await dataSourceMetadataRepository.getDatasourceMetadataForDatasourceId(id);

  if (!datasourceMetadata) {
    throw new DatasourceNotFoundException(id);
  }

  if (datasourceMetadata.fileType === fileTypes.CSV) {
    await dataSourceRepository.deleteDatasource(id);
  } else if (
    datasourceMetadata.fileType === fileTypes.GEOJSON ||
    datasourceMetadata.fileType === fileTypes.JSON
  ) {
    await deleteJsonFileFromFileSystem(datasourceMetadata.fileId);
  }

  await dashboardDatasourceMapRepository.deleteDataSourceDashboardMapping(id);
  await dataSourceMetadataRepository.deleteDatasourceMetadata(id);
}

async function createColumnInDataSource(expression, datasourceModal, columnName, schema) {
  const numericalField = Object.keys(schema).filter(
    (field) => schema[field] === dbDataTypes.number,
  );
  try {
    validateExpression(expression, numericalField);
    const formula = parseExpression(expression);
    return await dataSourceRepository.addColumn(datasourceModal, formula, columnName);
  } catch (error) {
    throw new InvalidInputException(invalidExpression.errorMessage, invalidExpression.errorCode);
  }
}

async function updateDataSourceMetadata(expression, columnName, datasourceId, schema) {
  await dataSourceMetadataRepository.updateDatasourceSchema(datasourceId, schema);
  return dataSourceMetadataRepository.updateOrInsertCustomColumn(datasourceId, {
    name: columnName,
    expression,
  });
}

async function getUpdatedSchema(dataSourceSchema, columnName) {
  return { ...dataSourceSchema, [columnName]: dbDataTypes.number };
}

async function deleteColumnFromSchema(datasourceId, columnName) {
  const { dataSourceSchema } = await dataSourceMetadataRepository.getDataSourceSchemaById(
    datasourceId,
  );
  delete dataSourceSchema[columnName];
  return dataSourceSchema;
}

async function deleteDatasourceMetadataForColumn(datasourceId, schema, columnName) {
  await dataSourceMetadataRepository.updateDatasourceSchema(datasourceId, schema);
  await dataSourceMetadataRepository.deleteCustomColumn(datasourceId, columnName);
}

async function updateDatasource(datasourceId, newColumnMetadata) {
  const { columnName, expression } = newColumnMetadata;
  const { dataSourceSchema } = await dataSourceMetadataRepository.getDataSourceSchemaById(
    datasourceId,
  );
  const isEditMode = await findCustomColumn(datasourceId, columnName);
  const error = validateColumnName(columnName, Object.keys(dataSourceSchema), isEditMode);
  if (error) {
    const invalidColumnNameError = invalidColumnName(error);
    throw new InvalidInputException(
      invalidColumnNameError.errorMessage,
      invalidColumnNameError.errorCode,
    );
  }
  const newDatasourceSchema = await getUpdatedSchema(dataSourceSchema, columnName);
  const datasourceModal = await getNewDataSourceModel(datasourceId, newDatasourceSchema);
  const datasource = await createColumnInDataSource(
    expression,
    datasourceModal,
    columnName,
    dataSourceSchema,
  );
  const metadata = await updateDataSourceMetadata(
    expression,
    columnName,
    datasourceId,
    newDatasourceSchema,
  );

  return { datasource, metadata };
}

async function deleteDatasourceColumn(datasourceId, columnName) {
  const newDatasourceSchema = await deleteColumnFromSchema(datasourceId, columnName);
  const datasourceModal = await getNewDataSourceModel(datasourceId, newDatasourceSchema);
  await dataSourceRepository.deleteColumn(datasourceModal, columnName);
  await deleteDatasourceMetadataForColumn(datasourceId, newDatasourceSchema, columnName);
}

module.exports = {
  getData,
  bulkDeleteDatasource,
  getJsonData,
  deleteDatasource,
  updateDatasource,
  deleteDatasourceColumn,
};
