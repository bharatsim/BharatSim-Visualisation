const datasourceDashboardMapService = require('../../src/services/datasourceDashboardMapService');
const dashboardDatasourceMapRepository = require('../../src/repository/dashboardDatasourceMapRepository');

jest.mock('../../src/repository/dashboardDatasourceMapRepository');

describe('datasource dashboard map service', () => {
  it('should add datasource dashboard mapping give datasource dashboard maps', async () => {
    dashboardDatasourceMapRepository.insertDatasourceDashboardMaps.mockResolvedValueOnce([
      {
        dashboardId: 'newDashboardId',
        datasourceId: 'newDashboardId',
      },
    ]);
    const data = await datasourceDashboardMapService.addDatasourceDashboardMaps([
      {
        dashboardId: 'newDashboardId',
        datasourceId: 'newDashboardId',
      },
    ]);
    expect(data).toEqual({ added: 1 });
    expect(dashboardDatasourceMapRepository.insertDatasourceDashboardMaps).toHaveBeenCalledWith([
      {
        dashboardId: 'newDashboardId',
        datasourceId: 'newDashboardId',
      },
    ]);
  });
  it('should delete datasource dashboard mapping given datasource dashboard map', async () => {
    dashboardDatasourceMapRepository.deleteDatasourceDashboardMap.mockResolvedValueOnce({
      deletedCount: 1,
    });
    const data = await datasourceDashboardMapService.deleteDatasourceDashboardMap({
      dashboardId: 'deleteDashboardId',
      datasourceId: 'deleteDashboardId',
    });
    expect(data).toEqual({ deletedCount: 1 });
    expect(dashboardDatasourceMapRepository.deleteDatasourceDashboardMap).toHaveBeenCalledWith({
      dashboardId: 'deleteDashboardId',
      datasourceId: 'deleteDashboardId',
    });
  });
});
