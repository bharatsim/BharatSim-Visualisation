const { getProjectedColumns, parseDBObject } = require('../utils/dbUtils');
const InvalidInputException = require('../exceptions/InvalidInputException');
const { deleteDatasourceMapping } = require('../repository/dashboardDatasourceMapRepository');
const dashboardRepository = require('../repository/dashboardRepository');

const {
  updateDashboardInvalidInput,
  insertDashboardInvalidInput,
} = require('../exceptions/errors');

async function updateDashboard(dashboardId, dashboardConfigs) {
  try {
    await dashboardRepository.update(dashboardId, dashboardConfigs);
  } catch (e) {
    throw new InvalidInputException(
      updateDashboardInvalidInput.errorMessage,
      updateDashboardInvalidInput.errorCode,
    );
  }
}

async function insertDashboard(dashboardConfigs) {
  try {
    const { _id } = await dashboardRepository.insert(dashboardConfigs);
    return { dashboardId: _id };
  } catch (e) {
    throw new InvalidInputException(
      insertDashboardInvalidInput.errorMessage,
      insertDashboardInvalidInput.errorCode,
    );
  }
}

async function saveDashboard(dashboardData) {
  const { dashboardId, ...dashboardConfigs } = dashboardData;
  if (dashboardId) {
    await updateDashboard(dashboardId, dashboardConfigs);
    return { dashboardId };
  }
  return insertDashboard(dashboardConfigs);
}

async function getAllDashboards(filters, columns) {
  const projectedColumns = getProjectedColumns(columns);
  const dashboards = await dashboardRepository.getAll(filters, projectedColumns);
  return { dashboards };
}

async function getDashboard(dashboardId) {
  const dashboard = await dashboardRepository.getOne(dashboardId);
  return { dashboard };
}

async function getActiveDashboardsFor(datasourceId) {
  const datasourceUsageCountInDashboardFilter = { 'charts.dataSourceIds': datasourceId };
  const dashboards = parseDBObject(
    await dashboardRepository.getAll(datasourceUsageCountInDashboardFilter),
  );
  return dashboards;
}

async function deleteDashboardAndMapping(dashboardId) {
  const { deletedCount } = await dashboardRepository.deleteOne(dashboardId);
  const { deletedCount: mappingDeletedCount } = await deleteDatasourceMapping(dashboardId);
  return { deletedCount, mappingDeletedCount };
}

async function deleteDashboardsAndMappingWithProjectId(projectId) {
  const { dashboards } = await getAllDashboards({ projectId }, ['_id']);
  return Promise.all(
    dashboards.map(({ _id: dashboardId }) => deleteDashboardAndMapping(dashboardId.toString())),
  );
}

module.exports = {
  saveDashboard,
  insertDashboard,
  getAllDashboards,
  getDashboard,
  getActiveDashboardsFor,
  deleteDashboardAndMapping,
  deleteDashboardsAndMappingWithProjectId,
};
