const DatasourceDashboardMap = require('../model/datasourceDashboardMap');

async function insertDatasourceDashboardMap(datasourceId, dashboardId) {
  const datasourceDashboardMap = new DatasourceDashboardMap({
    datasourceId,
    dashboardId,
  });
  return datasourceDashboardMap.save();
}

async function insertDatasourceDashboardMaps(datasourceDashboardMaps) {
  return DatasourceDashboardMap.insertMany(datasourceDashboardMaps);
}

async function getDatasourceIdsForDashboard(dashboardId) {
  return DatasourceDashboardMap.find({ dashboardId }, { datasourceId: 1 }).then((data) =>
    data.map((datasourceMatch) => {
      return datasourceMatch.datasourceId.toString();
    }),
  );
}

// TODO: Refactor - Add a single function to delete map
async function deleteDatasourceMapping(dashboardId) {
  return DatasourceDashboardMap.deleteMany({ dashboardId });
}

async function deleteDatasourceDashboardMap(datasourceDashboardMap) {
  return DatasourceDashboardMap.deleteOne(datasourceDashboardMap);
}

async function deleteDataSourceDashboardMapping(dataSourceId) {
  return DatasourceDashboardMap.deleteMany({ datasourceId: dataSourceId });
}

module.exports = {
  insertDatasourceDashboardMap,
  deleteDatasourceMapping,
  getDatasourceIdsForDashboard,
  deleteDataSourceDashboardMapping,
  insertDatasourceDashboardMaps,
  deleteDatasourceDashboardMap,
};
