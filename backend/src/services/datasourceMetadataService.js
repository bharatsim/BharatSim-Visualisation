const dataSourceMetadataRepository = require('../repository/datasourceMetadataRepository');
const dashboardDatasourceMapRepository = require('../repository/dashboardDatasourceMapRepository');
const dashboardRepository = require('../repository/dashboardRepository');
const projectRepository = require('../repository/projectRepository');
const dashboardService = require('./dashboardService');
const dbUtils = require('../utils/dbUtils');
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

async function getProjectAndDashboardMap(dashboards) {
  const projectAndDashboardMap = await dashboards.reduce(async (acc, dashboard) => {
    const { projectId, name: dashboardName } = dashboard;
    const accValue = await acc;
    if (!accValue[projectId]) {
      const { name } = parseDBObject(await projectRepository.getOne(projectId));
      accValue[projectId] = { project: { id: projectId, name }, dashboards: [] };
    }
    accValue[projectId].dashboards.push(dashboardName);
    return accValue;
  }, Promise.resolve({}));
  return Object.values(projectAndDashboardMap);
}

async function getDatasourcesWithUsagesCount(dataSources) {
  return Promise.all(
    dataSources.map(async (datasource) => {
      const { _id: id } = datasource;
      const dashboards = await dashboardService.getActiveDashboardsFor(id);
      const projectAndDashboardMap = await getProjectAndDashboardMap(dashboards);
      return { ...datasource, dashboardUsage: dashboards.length, usage: projectAndDashboardMap };
    }),
  );
}

async function getDatasourceWithWidgetAndDashboardUsageCount(dataSources, dashboardId) {
  return Promise.all(
    dataSources.map(async (datasource) => {
      const { _id: id } = datasource;
      const dashboards = await dashboardService.getActiveDashboardsFor(id);
      const projectAndDashboardMap = await getProjectAndDashboardMap(dashboards);
      const widgetUsage = await dashboardRepository.getChartCountForDatasource(id, dashboardId);
      return {
        ...datasource,
        dashboardUsage: dashboards.length,
        usage: projectAndDashboardMap,
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

async function getDatasourceMetadata(datasourceId) {
  const datasourceMetaData = await dataSourceMetadataRepository.getDatasourcesMetadata({
    _id: datasourceId,
  });
  return { datasourceMetaData: datasourceMetaData[0] };
}

module.exports = {
  getHeaders,
  getDatasources,
  getDatasourceMetadata,
};
