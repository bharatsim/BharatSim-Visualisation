const dataSourceMetadataRepository = require('../repository/datasourceMetadataRepository');
const dashboardDatasourceMapRepository = require('../repository/dashboardDatasourceMapRepository');
const dbUtils = require('../utils/dbUtils');
const { parseDBObject } = require('../utils/dbUtils');
const { getAllProjects } = require('./projectService');
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
  return dataSourceMetadataRepository.getManyDataSourcesMetadataByIds(datasourceIds);
}

async function getAllLinkedDataSources() {
  const { projects } = await getAllProjects();
  const assignedDatasources = await Promise.all(
    projects.map(async ({ _id: projectId, name: projectName }) => {
      return getDatasourcesForProjectId(projectId.toString(), projectName);
    }),
  );
  return assignedDatasources.flat();
}

async function getAllUnlinkedDataSources(mappedDatasourceIds) {
  return dataSourceMetadataRepository.getAllExceptDatasourceIds(
    mappedDatasourceIds,
  );
}

async function getDataSources({ projectId, dashboardId }) {
  if (!projectId && !dashboardId) {
    const linkedDataSources = await getAllLinkedDataSources();
    const linkedDatasourceIds = linkedDataSources.map(({ _id: datasourceId }) => datasourceId);
    const unlinkedDataSources = await getAllUnlinkedDataSources(linkedDatasourceIds);
    return { dataSources: [...unlinkedDataSources, ...linkedDataSources] };
  }
  if (dashboardId) {
    const dataSources = await getDatasourcesForDashboardId(dashboardId);
    return { dataSources };
  }
  const dataSources = await getDatasourcesForProjectId(projectId);
  return { dataSources };
}

module.exports = {
  getHeaders,
  getDataSources,
};
