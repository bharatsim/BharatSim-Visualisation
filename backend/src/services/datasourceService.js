const dataSourceRepository = require('../repository/datasourceRepository');
const dataSourceMetadataRepository = require('../repository/datasourceMetadataRepository');
const dashboardDatasourceMapRepository = require('../repository/dashboardDatasourceMapRepository');
const modelCreator = require('../utils/modelCreator');
const dbUtils = require('../utils/dbUtils');
const ColumnsNotFoundException = require('../exceptions/ColumnsNotFoundException');

function isNotProvidedDataHaveEqualColumns(data, columns) {
  return columns.length !== Object.keys(data).length;
}

async function getDataSourceModel(datasourceId) {
  const dataSourceSchema = await dataSourceMetadataRepository.getDataSourceSchemaById(datasourceId);
  return modelCreator.createModel(datasourceId, dataSourceSchema.dataSourceSchema);
}

async function getData(datasourceId, columns) {
  const dataSourceModel = await getDataSourceModel(datasourceId);
  const columnsMap = dbUtils.getProjectedColumns(columns);
  const dataRecords = await dataSourceRepository.getData(dataSourceModel, columnsMap);
  const data = dbUtils.changeRecordDimensionToArray(dataRecords);
  if (columns && isNotProvidedDataHaveEqualColumns(data, columns)) {
    throw new ColumnsNotFoundException();
  }
  return { data };
}


async function deleteDatasourceForDashboard(dashboardId) {
  const datasourceIds = await dashboardDatasourceMapRepository.getDatasourceIdsForDashboard(dashboardId);
  await dataSourceMetadataRepository.bulkDeleteDatasourceMetadata(datasourceIds);
  await dashboardDatasourceMapRepository.deleteDatasourceMapping(dashboardId);
  return dataSourceRepository.bulkDelete(datasourceIds);
}

module.exports = {
  getData,
  deleteDatasourceForDashboard,
};
