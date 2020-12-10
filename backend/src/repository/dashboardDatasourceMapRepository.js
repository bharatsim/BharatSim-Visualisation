const DatasourceDashboardMap = require('../model/datasourceDashboardMap');


async function insertDatasourceDashboardMap(datasourceId, dashboardId) {
  const datasourceDashboardMap = new DatasourceDashboardMap({
    datasourceId, dashboardId,
  });
  return datasourceDashboardMap.save();
}

async function getDatasourceIdsForDashboard(dashboardId) {
  return DatasourceDashboardMap.find({ dashboardId }, { datasourceId: 1 }).then(
    (data) => data.map((datasourceMatch) => {
      return datasourceMatch.datasourceId.toString();
    }),
  );
}


async function deleteDatasourceMapping(dashboardId) {
  return DatasourceDashboardMap.deleteMany({ dashboardId });
}

module.exports = {
  insertDatasourceDashboardMap,
  deleteDatasourceMapping,
  getDatasourceIdsForDashboard
};