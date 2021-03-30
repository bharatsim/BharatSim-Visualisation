const dataSourceMetadataRepository = require('../repository/datasourceMetadataRepository');
const dashboardDatasourceMapRepository = require('../repository/dashboardDatasourceMapRepository');
const dashboardRepository = require('../repository/dashboardRepository');
const dashboardService = require('./dashboardService');
const dbUtils = require('../utils/dbUtils');
const { DATASOURCE_USAGE_COUNT_FILTER_STRING } = require('../constants/dbConstants');
const { parseDBObject } = require('../utils/dbUtils');
const { getAllDashboards } = require('./dashboardService');

function transformDataSourceSchema(dataSourceSchema) {
  return Object.keys(dataSourceSchema).map((key) => ({ name: key, type: dataSourceSchema[key] }));
}

async function getHeaders(datasourceId) {
  const dataSource = await dataSourceMetadataRepository.getDataSourceSchemaById(datasourceId);
  const headers = transformDataSourceSchema(dataSource.dataSourceSchema);
  return { headers };
}

async function getAndTransformDataSources(
  { _id: dashboardId, name: dashboardName },
  projectId,
  projectName,
) {
  const dataSourcesForDashboard = await getDatasourcesForDashboardId(dashboardId.toString());
  return dataSourcesForDashboard.map((dataSourceForDashboard) => {
    return {
      ...parseDBObject(dataSourceForDashboard),
      projectId,
      dashboardId,
      projectName,
      dashboardName,
    };
  });
}

async function getDatasourcesForProjectId(projectId, projectName) {
  const { dashboards } = await getAllDashboards({ projectId }, ['_id', 'name']);
  return Promise.all(
    dashboards.map(async (dashboard) => {
      return getAndTransformDataSources(dashboard, projectId, projectName);
    }),
  )
    .then((data) => data.flat())
    .catch((err) => {
      throw err;
    });
}

async function getDatasourcesForDashboardId(dashboardId) {
  const datasourceIds = dbUtils.parseDBObject(
    await dashboardDatasourceMapRepository.getDatasourceIdsForDashboard(dashboardId),
  );
  return dataSourceMetadataRepository.getDataSourcesMetadataByIds(datasourceIds);
}

async function getDatasourcesWithUsagesCount(dataSources) {
  return Promise.all(
    dataSources.map(async (datasource) => {
      const { _id: id } = datasource;
      const usage = await dashboardService.getActiveDashboardCountFor({
        [DATASOURCE_USAGE_COUNT_FILTER_STRING]: id,
      });
      return { ...datasource, dashboardUsage: usage.count };
    }),
  );
}

async function getDatasourceWithWidgetAndDashboardUsageCount(dataSources, dashboardId) {
  return Promise.all(
    dataSources.map(async (datasource) => {
      const { _id: id } = datasource;
      const dashboardUsage = await dashboardService.getActiveDashboardCountFor(id);
      const widgetUsage = await dashboardRepository.getChartCountForDatasource(id, dashboardId);
      return {
        ...datasource,
        dashboardUsage: dashboardUsage.count,
        widgetUsage: widgetUsage.count,
      };
    }),
  );
}

async function getDatasources({ projectId, dashboardId }) {
  const projectForDataSource = { __v: 0, dataSourceSchema: 0 };
  if (!projectId && !dashboardId) {
    const dataSources = dbUtils.parseDBObject(
      await dataSourceMetadataRepository.getDatasourcesMetadata({}, projectForDataSource),
    );
    const updatedDatasources = await getDatasourcesWithUsagesCount(dataSources);
    return { dataSources: updatedDatasources };
  }
  if (dashboardId) {
    const dataSources = dbUtils.parseDBObject(await getDatasourcesForDashboardId(dashboardId));
    const updatedDatasources = await getDatasourceWithWidgetAndDashboardUsageCount(
      dataSources,
      dashboardId,
    );
    return { dataSources: updatedDatasources };
  }
  const dataSources = await getDatasourcesForProjectId(projectId);
  return { dataSources };
}

module.exports = {
  getHeaders,
  getDatasources,
};
