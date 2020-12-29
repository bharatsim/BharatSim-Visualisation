const dataSourceMetadataRepository = require('../repository/datasourceMetadataRepository');
const dashboardDatasourceMapRepository = require('../repository/dashboardDatasourceMapRepository');
const dbUtils = require('../utils/dbUtils');
const InvalidInputException = require('../exceptions/InvalidInputException');
const { missingIds } = require('../exceptions/errors');
const { getAllDashboards } = require('./dashboardService');

function transformDataSourceSchema(dataSourceSchema) {
  return Object.keys(dataSourceSchema).map((key) => ({ name: key, type: dataSourceSchema[key] }));
}

async function getHeaders(datasourceId) {
  const dataSource = await dataSourceMetadataRepository.getDataSourceSchemaById(datasourceId);
  const headers = transformDataSourceSchema(dataSource.dataSourceSchema);
  return { headers };
}

function mergeAllDatasourceIdsFromDashboards(datasourceIdsForDashboards) {
  return datasourceIdsForDashboards.flatMap((datasourceIdsForDashboard) => {
    return datasourceIdsForDashboard;
  });
}

async function getDatasourcesForProjectId(projectId) {
  const { dashboards: dashboardIds } = await getAllDashboards({ projectId }, ['_id']);
  return Promise.all(
    dashboardIds.map(async ({ _id: dashboardId }) => {
      return getDatasourceIdsForDashboard(dashboardId.toString());
    }),
  )
    .then(mergeAllDatasourceIdsFromDashboards)
    .catch((err) => {
      throw err;
    });
}

async function getDatasourceIdsForDashboard(dashboardId) {
  const datasourceIds = dbUtils.parseDBObject(
    await dashboardDatasourceMapRepository.getDatasourceIdsForDashboard(dashboardId),
  );
  return dataSourceMetadataRepository.getManyDataSourcesMetadataByIds(datasourceIds);
}

async function getDataSources({ projectId, dashboardId }) {
  if (!projectId && !dashboardId) {
    throw new InvalidInputException(missingIds.errorMessage, missingIds.errorCode);
  }
  if (dashboardId) {
    const dataSources = await getDatasourceIdsForDashboard(dashboardId);
    return { dataSources };
  }
  const dataSources = await getDatasourcesForProjectId(projectId);
  return { dataSources };
}

module.exports = {
  getHeaders,
  getDataSources,
};
