const fs = require('fs');
const dataSourceRepository = require('../repository/datasourceRepository');
const dataSourceMetadataRepository = require('../repository/datasourceMetadataRepository');
const modelCreator = require('../utils/modelCreator');
const dbUtils = require('../utils/dbUtils');

const ColumnsNotFoundException = require('../exceptions/ColumnsNotFoundException');
const DatasourceNotFoundException = require('../exceptions/DatasourceNotFoundException');
const { EXTENDED_JSON_TYPES } = require('../constants/fileTypes');
const { fileTypes } = require('../constants/fileTypes');

const FILE_UPLOAD_PATH = './uploads/';

function isNotProvidedDataHaveEqualColumns(data, columns) {
  return columns.length !== Object.keys(data).length;
}

async function getDataSourceModel(datasourceId) {
  const dataSourceSchema = await dataSourceMetadataRepository.getDataSourceSchemaById(datasourceId);
  return modelCreator.createModel(datasourceId, dataSourceSchema.dataSourceSchema);
}

async function getData(datasourceId, columns, aggregationParams) {
  const uniqueColumns = [...new Set(columns)];
  const datasourceMetadata = await dataSourceMetadataRepository.getDatasourceMetadataForDatasourceId(
    datasourceId,
  );
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
    return getCsvData(datasourceId, uniqueColumns, aggregationParams);
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

  parsedData.features = features.filter((feature) => {
    return feature.properties[propertyKey] === value;
  });
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

async function getCsvData(datasourceId, columns, aggregationParams) {
  const dataSourceModel = await getDataSourceModel(datasourceId);
  const columnsMap = dbUtils.getProjectedColumns([...columns]);
  let allColumns = columns;
  const dataRecords = await getDataRecord(aggregationParams, dataSourceModel, columnsMap);

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

async function getDataRecord(aggregationParams, dataSourceModel, columnsMap) {
  if (aggregationParams) {
    return dataSourceRepository.getAggregatedData(dataSourceModel, aggregationParams);
  }
  return dataSourceRepository.getData(dataSourceModel, columnsMap);
}

async function deleteCsvFiles(datasourceIds) {
  const csvDatasourcesMetadata = await dataSourceMetadataRepository.filterDatasourceIds(
    datasourceIds,
    { fileType: 'csv' },
  );
  const csvMetadataIds = csvDatasourcesMetadata.map(({ _id }) => {
    return _id.toString();
  });
  return dataSourceRepository.bulkDeleteCsv(csvMetadataIds);
}

async function deleteJsonFiles(datasourceIds) {
  const datasourcesMetadata = await dataSourceMetadataRepository.filterDatasourceIds(
    datasourceIds,
    { fileType: { $in: ['json', ...EXTENDED_JSON_TYPES] } },
  );
  datasourcesMetadata.forEach(({ fileId }) => {
    if (fs.existsSync(`${FILE_UPLOAD_PATH}${fileId}`)) {
      fs.rmdirSync(`${FILE_UPLOAD_PATH}${fileId}`, { recursive: true });
    }
  });
}

async function bulkDeleteDatasource(datasourceIds) {
  await Promise.all([deleteCsvFiles(datasourceIds), deleteJsonFiles(datasourceIds)]);
  await dataSourceMetadataRepository.bulkDeleteDatasourceMetadata(datasourceIds);
  return { deletedCount: datasourceIds.length };
}

module.exports = {
  getData,
  bulkDeleteDatasource,
  getJsonData,
};
