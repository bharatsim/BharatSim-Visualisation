const dataSourceMetadataService = require('../../src/services/datasourceMetadataService');
const dataSourceMetadataRepository = require('../../src/repository/datasourceMetadataRepository');
const dashboardDatasourceMapRepository = require('../../src/repository/dashboardDatasourceMapRepository');

jest.mock('../../src/repository/dataSourceMetadataRepository');
jest.mock('../../src/repository/dashboardDatasourceMapRepository');

describe('dataSourceMetadataService', () => {
  beforeEach(()=>{
    dashboardDatasourceMapRepository.getDatasourceIdsForDashboard.mockResolvedValue(['id1', 'id2']);
    const mockResolvedValue = [
      { _id: 'id1', name: 'model_1' },
      { _id: 'id2', name: 'model_2' },
    ];
    dataSourceMetadataRepository.getManyDataSourcesMetadataByIds.mockResolvedValue(
      mockResolvedValue,
    );
    dashboardDatasourceMapRepository.getDatasourceIdsForDashboard.mockResolvedValue(['id1', 'id2']);
  })
  afterEach(()=>{
    jest.clearAllMocks();
  })

  it('should get data sources name', async () => {
    const data = await dataSourceMetadataService.getDataSourcesByDashboardId('dashboardId');

    expect(data).toEqual({
      dataSources: [
        { _id: 'id1', name: 'model_1' },
        { _id: 'id2', name: 'model_2' },
      ],
    });
  });

  it('should get data sources filter by dashboard id', async () => {
    const dashboardId = 'dashboardId';

    const data = await dataSourceMetadataService.getDataSourcesByDashboardId(dashboardId);

    expect(data).toEqual({
      dataSources: [
        { _id: 'id1', name: 'model_1' },
        { _id: 'id2', name: 'model_2' },
      ],
    });
  });

  it('should call getManyDataSourcesMetadataByIds with datasource ids ', async () => {
    const dashboardId = 'dashboardId';

    await dataSourceMetadataService.getDataSourcesByDashboardId(dashboardId);

    expect(dataSourceMetadataRepository.getManyDataSourcesMetadataByIds).toHaveBeenCalledWith(['id1','id2']);
  });

  it('should call getDatasourceIdsForDashboard with dashboaord id ', async () => {
    const dashboardId = 'dashboardId';

    await dataSourceMetadataService.getDataSourcesByDashboardId(dashboardId);

    expect(dashboardDatasourceMapRepository.getDatasourceIdsForDashboard).toHaveBeenCalledWith('dashboardId');
  });

  it('should get headers from datasource', async () => {
    dataSourceMetadataRepository.getDataSourceSchemaById.mockResolvedValue({
      dataSourceSchema: {
        hour: 'number',
        susceptible: 'number',
      },
    });
    const dataSourceId = 'model_1_id';

    const data = await dataSourceMetadataService.getHeaders(dataSourceId);

    expect(data).toEqual({
      headers: [
        { name: 'hour', type: 'number' },
        { name: 'susceptible', type: 'number' },
      ],
    });
    expect(dataSourceMetadataRepository.getDataSourceSchemaById).toHaveBeenCalledWith('model_1_id');
  });
});
