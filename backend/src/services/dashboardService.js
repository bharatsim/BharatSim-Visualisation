const { getProjectedColumns } = require('../utils/dbUtils');
const InvalidInputException = require('../exceptions/InvalidInputException');
const { insert, update, getAll, getOne } = require('../repository/dashboardRepository');
const {
  updateDashboardInvalidInput,
  insertDashboardInvalidInput,
} = require('../exceptions/errors');

async function updateDashboard(dashboardId, dashboardConfigs) {
  try {
    await update(dashboardId, dashboardConfigs);
  } catch (e) {
    throw new InvalidInputException(
      updateDashboardInvalidInput.errorMessage,
      updateDashboardInvalidInput.errorCode,
    );
  }
}

async function insertDashboard(dashboardConfigs) {
  try {
    const { _id } = await insert(dashboardConfigs);
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
  const dashboards = await getAll(filters, projectedColumns);
  return { dashboards };
}
async function getDashboard(dashboardId) {
  const dashboard = await getOne(dashboardId);
  return { dashboard };
}

module.exports = { saveDashboard, insertDashboard, getAllDashboards, getDashboard };
