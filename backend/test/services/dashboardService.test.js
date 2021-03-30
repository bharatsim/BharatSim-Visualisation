const {
  saveDashboard,
  getAllDashboards,
  getDashboard,
  getActiveDashboardCountFor,
} = require('../../src/services/dashboardService');
const dashboardRepository = require('../../src/repository/dashboardRepository');
const InvalidInputException = require('../../src/exceptions/InvalidInputException');
const dashboardDatasourceMapRepository = require('../../src/repository/dashboardDatasourceMapRepository');
const { deleteDashboardAndMapping } = require('../../src/services/dashboardService');

jest.mock('../../src/repository/dashboardRepository');
jest.mock('../../src/repository/dashboardDatasourceMapRepository');

const dashboardDataToUpdate = { dashboardId: 'id', dataConfig: { name: 'newName' } };
const dashboardDataToAdd = { dashboardId: undefined, dataConfig: { name: 'name' } };

describe('Dashboard Service', function () {
  it('should insert dashboard data if id is undefined ', function () {
    dashboardRepository.insert.mockResolvedValue({ _id: 'new_id' });

    saveDashboard(dashboardDataToAdd);

    expect(dashboardRepository.insert).toHaveBeenCalledWith({ dataConfig: { name: 'name' } });
  });
  it('should insert dashboard data if id is undefined and return new id', async function () {
    dashboardRepository.insert.mockResolvedValue({ _id: 'new_id' });

    const result = await saveDashboard(dashboardDataToAdd);

    expect(result).toEqual({ dashboardId: 'new_id' });
  });

  it('should update dashboard data for given id ', function () {
    saveDashboard(dashboardDataToUpdate);
    expect(dashboardRepository.update).toHaveBeenCalledWith('id', {
      dataConfig: { name: 'newName' },
    });
  });
  it('should throw error for invalid inputs while updating', async function () {
    dashboardRepository.update.mockImplementationOnce(() => {
      throw new Error('msg');
    });

    const result = async () => {
      await saveDashboard(dashboardDataToUpdate);
    };
    await expect(result).rejects.toThrow(
      new InvalidInputException('Error while updating dashboard with invalid data', '1004'),
    );
  });
  it('should throw error for invalid inputs while inserting', async function () {
    dashboardRepository.insert.mockRejectedValue(new Error('msg'));

    const result = async () => {
      await saveDashboard(dashboardDataToAdd);
    };
    await expect(result).rejects.toThrow(
      new InvalidInputException('Error while inserting dashboard with invalid data', 1005),
    );
  });

  it('should update dashboard data and return new id', async function () {
    const result = await saveDashboard(dashboardDataToUpdate);

    expect(result).toEqual({ dashboardId: 'id' });
  });

  it('should called getAll dashboards', async function () {
    await getAllDashboards();

    expect(dashboardRepository.getAll).toHaveBeenCalled();
  });

  it('should get all dashboards', async function () {
    dashboardRepository.getAll.mockResolvedValue([{ _id: '123' }, { _id: '123' }]);

    const fetchedDashboard = await getAllDashboards();

    expect(fetchedDashboard).toEqual({ dashboards: [{ _id: '123' }, { _id: '123' }] });
  });
  it('should called get dashboard by dashboard id', async function () {
    dashboardRepository.getOne.mockResolvedValue({ _id: 'dashboardId' });
    const fetchedDashboard = await getDashboard('dashboardId');

    expect(fetchedDashboard).toEqual({
      dashboard: { _id: 'dashboardId' },
    });
  });

  it('should called getAll dashboards by projectId', async function () {
    await getAllDashboards({ projectId: 'projectId' }, ['name', '_id']);

    expect(dashboardRepository.getAll).toHaveBeenCalledWith(
      { projectId: 'projectId' },
      { _id: 1, name: 1 },
    );
  });
  it('should call getOne dashboard by dashboard id', async function () {
    await getDashboard('dashboardId');
    expect(dashboardRepository.getOne).toHaveBeenCalledWith('dashboardId');
  });
  it('should call deleteOne dashboard and its datasource mapping given dashboard id', async function () {
    dashboardDatasourceMapRepository.deleteDatasourceMapping.mockResolvedValueOnce({
      deletedCount: 1,
    });
    dashboardRepository.deleteOne.mockResolvedValueOnce({ deletedCount: 1 });
    const result = await deleteDashboardAndMapping('dashboardId');

    expect(result).toEqual({ deletedCount: 1, mappingDeletedCount: 1 });
    expect(dashboardRepository.deleteOne).toHaveBeenCalledWith('dashboardId');
    expect(dashboardDatasourceMapRepository.deleteDatasourceMapping).toHaveBeenCalledWith(
      'dashboardId',
    );
  });

  it('should call getCount and return the result', async () => {
    dashboardRepository.getCount.mockResolvedValueOnce(1);

    const result = await getActiveDashboardCountFor('datasource');

    expect(dashboardRepository.getCount).toHaveBeenCalledWith({
      'charts.dataSourceIds': 'datasource',
    });
    expect(result).toEqual({ count: 1 });
  });
});
