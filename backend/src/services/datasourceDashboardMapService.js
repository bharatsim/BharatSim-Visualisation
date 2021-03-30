const dashboardDatasourceMapRepository = require('../repository/dashboardDatasourceMapRepository');

async function addDatasourceDashboardMaps(datasourceDashboardMaps) {
  const result = await dashboardDatasourceMapRepository.insertDatasourceDashboardMaps(
    datasourceDashboardMaps,
  );
  return { added: result.length };
}

async function deleteDatasourceDashboardMap(datasourceDashboardMap) {
  return dashboardDatasourceMapRepository.deleteDatasourceDashboardMap(datasourceDashboardMap);
}

module.exports = {
  addDatasourceDashboardMaps,
  deleteDatasourceDashboardMap,
};
