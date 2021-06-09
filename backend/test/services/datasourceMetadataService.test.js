const datasourceMetadataService = require('../../src/services/datasourceMetadataService');
const dashboardService = require('../../src/services/dashboardService');
const dataSourceMetadataRepository = require('../../src/repository/datasourceMetadataRepository');
const dashboardDatasourceMapRepository = require('../../src/repository/dashboardDatasourceMapRepository');
const dashboardRepository = require('../../src/repository/dashboardRepository');
const projectRepository = require('../../src/repository/projectRepository');

jest.mock('../../src/repository/datasourceMetadataRepository');
jest.mock('../../src/repository/dashboardDatasourceMapRepository');
jest.mock('../../src/services/dashboardService');
jest.mock('../../src/services/projectService');
jest.mock('../../src/repository/dashboardRepository');
jest.mock('../../src/repository/projectRepository');

describe('datasourceMetadataService', () => {
  beforeEach(() => {
    dashboardDatasourceMapRepository.getDatasourceIdsForDashboard.mockResolvedValue(['id1', 'id2']);
    const mockResolvedValue = [
      { _id: 'id1', name: 'model_1' },
      { _id: 'id2', name: 'model_2' },
    ];
    dashboardService.getActiveDashboardsFor.mockResolvedValue([
      { _id: 1, projectId: 1, name: 'dashboard1' },
      { _id: 2, projectId: 1, name: 'dashboard2' },
    ]);
    dataSourceMetadataRepository.getDataSourcesMetadataByIds.mockResolvedValue(mockResolvedValue);
    dataSourceMetadataRepository.getDatasourcesMetadata.mockResolvedValue(mockResolvedValue);
    dashboardDatasourceMapRepository.getDatasourceIdsForDashboard.mockResolvedValue(['id1', 'id2']);
    dashboardRepository.getChartCountForDatasource.mockResolvedValue({ count: 1 });
    projectRepository.getOne.mockResolvedValue({ _id: 1, name: 'project2' });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get data sources name', async () => {
    const data = await datasourceMetadataService.getDatasources({ dashboardId: 'dashboardId' });

    expect(data).toEqual({
      dataSources: [
        {
          _id: 'id1',
          name: 'model_1',
          dashboardUsage: 2,
          widgetUsage: 1,
          usage: [
            {
              dashboards: ['dashboard1', 'dashboard2'],
              project: {
                id: 1,
                name: 'project2',
              },
            },
          ],
        },
        {
          _id: 'id2',
          name: 'model_2',
          dashboardUsage: 2,
          widgetUsage: 1,
          usage: [
            {
              dashboards: ['dashboard1', 'dashboard2'],
              project: {
                id: 1,
                name: 'project2',
              },
            },
          ],
        },
      ],
    });
  });
  it('should give all the dataSources', async () => {
    const result = await datasourceMetadataService.getDatasources({});
    const expected = {
      dataSources: [
        {
          _id: 'id1',
          name: 'model_1',
          dashboardUsage: 2,
          usage: [
            {
              dashboards: ['dashboard1', 'dashboard2'],
              project: {
                id: 1,
                name: 'project2',
              },
            },
          ],
        },
        {
          _id: 'id2',
          name: 'model_2',
          dashboardUsage: 2,
          usage: [
            {
              dashboards: ['dashboard1', 'dashboard2'],
              project: {
                id: 1,
                name: 'project2',
              },
            },
          ],
        },
      ],
    };
    await expect(result).toEqual(expected);
  });

  it('should get data sources filter by dashboard id', async () => {
    const dashboardId = 'dashboardId';

    const data = await datasourceMetadataService.getDatasources({ dashboardId });

    expect(data).toEqual({
      dataSources: [
        {
          _id: 'id1',
          name: 'model_1',
          dashboardUsage: 2,
          widgetUsage: 1,
          usage: [
            {
              dashboards: ['dashboard1', 'dashboard2'],
              project: {
                id: 1,
                name: 'project2',
              },
            },
          ],
        },
        {
          _id: 'id2',
          name: 'model_2',
          dashboardUsage: 2,
          widgetUsage: 1,
          usage: [
            {
              dashboards: ['dashboard1', 'dashboard2'],
              project: {
                id: 1,
                name: 'project2',
              },
            },
          ],
        },
      ],
    });
  });
  it('should get datasources for given project id', async () => {
    dashboardService.getAllDashboards.mockResolvedValueOnce({
      dashboards: [{ _id: 'dashboardId1' }, { _id: 'dashboardId2' }],
    });
    const data = await datasourceMetadataService.getDatasources({ projectId: 'projectId' });
    expect(data).toEqual({
      dataSources: [
        {
          _id: 'id1',
          dashboardId: 'dashboardId1',
          name: 'model_1',
          projectId: 'projectId',
        },
        {
          _id: 'id2',
          dashboardId: 'dashboardId1',
          name: 'model_2',
          projectId: 'projectId',
        },
        {
          _id: 'id1',
          dashboardId: 'dashboardId2',
          name: 'model_1',
          projectId: 'projectId',
        },
        {
          _id: 'id2',
          dashboardId: 'dashboardId2',
          name: 'model_2',
          projectId: 'projectId',
        },
      ],
    });
  });
  it('should throw error if any while fetching datasources for project id', async () => {
    dashboardDatasourceMapRepository.getDatasourceIdsForDashboard.mockRejectedValueOnce(
      new Error('Some Error'),
    );
    dashboardService.getAllDashboards.mockResolvedValueOnce({
      dashboards: [{ _id: 'dashboardId1' }, { _id: 'dashboardId2' }],
    });
    const result = async () => {
      await datasourceMetadataService.getDatasources({ projectId: 'projectId' });
    };
    await expect(result).rejects.toThrow(new Error('Some Error'));
  });
  it('should get datasources for given dashboard id even if projectId is defined', async () => {
    const data = await datasourceMetadataService.getDatasources({
      projectId: 'projectId',
      dashboardId: 'dashboardId',
    });
    expect(data).toEqual({
      dataSources: [
        {
          _id: 'id1',
          name: 'model_1',
          dashboardUsage: 2,
          widgetUsage: 1,
          usage: [
            {
              dashboards: ['dashboard1', 'dashboard2'],
              project: {
                id: 1,
                name: 'project2',
              },
            },
          ],
        },
        {
          _id: 'id2',
          name: 'model_2',
          dashboardUsage: 2,
          widgetUsage: 1,
          usage: [
            {
              dashboards: ['dashboard1', 'dashboard2'],
              project: {
                id: 1,
                name: 'project2',
              },
            },
          ],
        },
      ],
    });
    expect(dashboardService.getAllDashboards).not.toHaveBeenCalled();
  });

  it('should call getManyDataSourcesMetadataByIds with datasource ids ', async () => {
    const dashboardId = 'dashboardId';

    await datasourceMetadataService.getDatasources({ dashboardId });

    expect(dataSourceMetadataRepository.getDataSourcesMetadataByIds).toHaveBeenCalledWith([
      'id1',
      'id2',
    ]);
  });

  it('should call getDatasourceIdsForDashboard with dashboaord id ', async () => {
    const dashboardId = 'dashboardId';

    await datasourceMetadataService.getDatasources({ dashboardId });

    expect(dashboardDatasourceMapRepository.getDatasourceIdsForDashboard).toHaveBeenCalledWith(
      'dashboardId',
    );
  });

  it('should get headers from datasource', async () => {
    dataSourceMetadataRepository.getDataSourceSchemaById.mockResolvedValue({
      dataSourceSchema: {
        hour: 'number',
        susceptible: 'number',
      },
    });
    const dataSourceId = 'model_1_id';

    const data = await datasourceMetadataService.getHeaders(dataSourceId);

    expect(data).toEqual({
      headers: [
        { name: 'hour', type: 'number' },
        { name: 'susceptible', type: 'number' },
      ],
    });
    expect(dataSourceMetadataRepository.getDataSourceSchemaById).toHaveBeenCalledWith('model_1_id');
  });

  it('should get all metadata for datasource', async () => {
    dataSourceMetadataRepository.getDatasourcesMetadata.mockResolvedValue([
      {
        _id: 'id1',
        name: 'model_1',
        dashboardUsage: 2,
        widgetUsage: 1,
        usage: [
          {
            dashboards: ['dashboard1', 'dashboard2'],
            project: {
              id: 1,
              name: 'project2',
            },
          },
        ],
      },
    ]);

    const dataSourceId = 'id1';

    const data = await datasourceMetadataService.getDatasourceMetadata(dataSourceId);

    expect(data).toEqual({
      datasourceMetaData: {
        _id: 'id1',
        name: 'model_1',
        dashboardUsage: 2,
        widgetUsage: 1,
        usage: [
          {
            dashboards: ['dashboard1', 'dashboard2'],
            project: {
              id: 1,
              name: 'project2',
            },
          },
        ],
      },
    });

    expect(dataSourceMetadataRepository.getDatasourcesMetadata).toHaveBeenCalledWith({
      _id: 'id1',
    });
  });
});
