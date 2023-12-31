import { api } from '../api';
import { fetchData, uploadData } from '../fetch';

jest.mock('../fetch', () => ({
  fetchData: jest.fn(),
  uploadData: jest.fn(),
}));

describe('API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should call save dashboard api with provided data', () => {
    const data = { charts: [], layout: [], dashboardId: 'id', name: 'name', count: 0 };

    const expectedParameter = {
      data: JSON.stringify({
        dashboardData: {
          charts: [],
          layout: [],
          dashboardId: 'id',
          name: 'name',
          count: 0,
          notes: '',
        },
      }),
      headers: { 'content-type': 'application/json' },
      url: '/api/dashboard',
      isCustomErrorHandler: true,
      isCustomLoader: true,
    };

    api.saveDashboard(data);

    expect(uploadData).toHaveBeenCalledWith(expectedParameter);
  });
  it('should call save dashboard api with provided notes data', () => {
    const data = {
      charts: [],
      layout: [],
      dashboardId: 'id',
      name: 'name',
      count: 0,
      notes: 'notes',
    };

    const expectedParameter = {
      data: JSON.stringify({
        dashboardData: {
          charts: [],
          layout: [],
          dashboardId: 'id',
          name: 'name',
          count: 0,
          notes: 'notes',
        },
      }),
      headers: { 'content-type': 'application/json' },
      url: '/api/dashboard',
      isCustomErrorHandler: true,
      isCustomLoader: true,
    };

    api.saveDashboard(data);

    expect(uploadData).toHaveBeenCalledWith(expectedParameter);
  });

  it('should call dashboard api to get all dashboard', () => {
    const expectedParameter = {
      url: '/api/dashboard',
    };

    api.getAllDashBoard();

    expect(fetchData).toHaveBeenCalledWith(expectedParameter);
  });

  it('should call dashboard api to get all dashboard filter by project id with projected columns', () => {
    const expectedParameter = {
      url: '/api/dashboard',
      query: {
        columns: ['name', '_id'],
        projectId: 'projectId',
      },
    };

    api.getAllDashBoardByProjectId('projectId');

    expect(fetchData).toHaveBeenCalledWith(expectedParameter);
  });

  it('should call dashboard api to insert new dashboard', () => {
    const expectedParameter = {
      data: JSON.stringify({
        dashboardData: {
          widgets: [],
          layout: [],
          name: 'dashbaord1',
          count: 0,
          projectId: 'projectId',
        },
      }),
      headers: {
        'content-type': 'application/json',
      },
      url: '/api/dashboard/create-new',
      isCustomErrorHandler: true,
    };

    api.addNewDashboard({ name: 'dashbaord1', projectId: 'projectId' });

    expect(uploadData).toHaveBeenCalledWith(expectedParameter);
  });

  it('should call datasources api to upload provided file and schema', () => {
    const data = { file: { name: 'fileName' }, schema: 'schema' };

    const expectedParameter = {
      data: expect.any(FormData),
      headers: { 'content-type': 'multipart/form-data' },
      url: '/api/dataSources',
    };

    api.uploadFileAndSchema(data);

    expect(uploadData).toHaveBeenCalledWith(expectedParameter);
  });

  it('should call datasources api to get all datasources for dashboard id', () => {
    const expectedParameter = {
      url: '/api/dataSources',
      query: {
        dashboardId: 'dashboardId',
      },
      isCustomErrorHandler: true,
      isCustomLoader: true,
    };

    api.getDatasources('dashboardId');

    expect(fetchData).toHaveBeenCalledWith(expectedParameter);
  });
  it('should call datasources api to get all data sources', () => {
    const expectedParameter = {
      url: '/api/dataSources',
    };

    api.getAllDatasources();

    expect(fetchData).toHaveBeenCalledWith(expectedParameter);
  });
  it('should call datasources api to get all datasources for project', () => {
    const expectedParameter = {
      url: '/api/dataSources',
      query: {
        projectId: 'projectId',
      },
    };

    api.getDatasourcesForProject('projectId');

    expect(fetchData).toHaveBeenCalledWith(expectedParameter);
  });

  it('should call datasources/headers api to get headers for given datasource', () => {
    const dataId = 'id';
    const expectedParameter = {
      url: '/api/dataSources/id/headers',
      isCustomErrorHandler: true,
      isCustomLoader: true,
    };

    api.getCsvHeaders(dataId);

    expect(fetchData).toHaveBeenCalledWith(expectedParameter);
  });

  it('should call datasources/data api to get data for given datasource', () => {
    const expectedParameter = {
      query: { columns: 'columns', limit: 0 },
      url: '/api/dataSources/id',
      isCustomErrorHandler: true,
      isCustomLoader: true,
    };

    api.getData('id', 'columns');

    expect(fetchData).toHaveBeenCalledWith(expectedParameter);
  });

  it('should call projects api to get all the saved projects', () => {
    const expectedParameter = {
      url: '/api/projects',
    };

    api.getProjects();

    expect(fetchData).toHaveBeenCalledWith(expectedParameter);
  });

  it('should should call save new project with given name', () => {
    const projectData = JSON.stringify({ projectData: { name: 'untitled project' } });
    const expectedParameter = {
      data: projectData,
      headers: { 'content-type': 'application/json' },
      url: '/api/projects',
      method: 'post',
      isCustomErrorHandler: true,
    };

    api.saveProject({ id: undefined, name: 'untitled project' });

    expect(uploadData).toHaveBeenCalledWith(expectedParameter);
  });

  it('should should update old project for given id with given data', () => {
    const projectData = JSON.stringify({
      projectData: { name: 'updated project', id: 'projectId' },
    });
    const expectedParameter = {
      data: projectData,
      headers: { 'content-type': 'application/json' },
      url: '/api/projects',
      method: 'put',
      isCustomErrorHandler: true,
    };

    api.saveProject({ name: 'updated project', id: 'projectId' });

    expect(uploadData).toHaveBeenCalledWith(expectedParameter);
  });
  it('should call projects api with given project id', () => {
    const expectedParameter = {
      url: '/api/projects/1',
    };

    api.getProject('1');

    expect(fetchData).toHaveBeenCalledWith(expectedParameter);
  });
  it('should call dashboard api with given dashboard id', () => {
    const expectedParameter = {
      url: '/api/dashboard/dashboard1',
    };

    api.getDashboard('dashboard1');

    expect(fetchData).toHaveBeenCalledWith(expectedParameter);
  });

  it('should call delete dashboard api with given dashboard id', () => {
    const expectedParameter = {
      url: '/api/dashboard/dashboard1',
      method: 'delete',
      isCustomErrorHandler: true,
    };

    api.deleteDashboard('dashboard1');

    expect(fetchData).toHaveBeenCalledWith(expectedParameter);
  });
  it('should call delete project api with given project id', () => {
    const expectedParameter = {
      url: '/api/projects/projectId',
      method: 'delete',
      isCustomErrorHandler: true,
    };
    api.deleteProject('projectId');
    expect(fetchData).toHaveBeenCalledWith(expectedParameter);
  });

  it('should call delete datasources for given datasource ids', () => {
    const expectedParameter = {
      url: '/api/dataSources',
      query: {
        datasourceIds: ['datasourceId'],
      },
      isCustomErrorHandler: true,
      method: 'delete',
    };

    api.deleteDatasources(['datasourceId']);

    expect(fetchData).toHaveBeenCalledWith(expectedParameter);
  });

  it('should call get aggragated data with group by and column to aggregate aggregate', () => {
    const expectedParameter = {
      url: '/api/dataSources/id',
      query: {
        aggregationParams: { groupBy: ['column1'], aggregate: { column: 'sum' } },
      },
      isCustomErrorHandler: true,
      isCustomLoader: true,
    };

    api.getAggregatedData('id', ['column1'], { column: 'sum' });

    expect(fetchData).toHaveBeenCalledWith(expectedParameter);
  });

  it('should call get aggregated geojson without filter', () => {
    const expectedParameter = {
      url: '/api/dataSources/id',
      query: undefined,
      isCustomErrorHandler: true,
      isCustomLoader: true,
    };

    api.getAggregatedGeoJson('id');

    expect(fetchData).toHaveBeenCalledWith(expectedParameter);
  });

  it('should call get aggregated geojson with filter', () => {
    const expectedParameter = {
      url: '/api/dataSources/id',
      query: {
        aggregationParams: { filter: { propertyKey: 'key', value: 'value' } },
      },
      isCustomErrorHandler: true,
      isCustomLoader: true,
    };

    api.getAggregatedGeoJson('id', { propertyKey: 'key', value: 'value' });

    expect(fetchData).toHaveBeenCalledWith(expectedParameter);
  });

  it('should call delete datasource', () => {
    const expectedParameter = {
      url: '/api/dataSources/id',
      method: 'delete',
    };

    api.deleteDatasource('id');

    expect(fetchData).toHaveBeenCalledWith(expectedParameter);
  });

  it('should call add datasource and dashboard map ', () => {
    const expectedParameter = {
      url: '/api/dashboard-datasource-map',
      method: 'post',
      data: {
        datasourceDashboardMaps: [
          { dashboardId: 'dashboardId1', datasourceId: 'datasourceId1' },
          { dashboardId: 'dashboardId2', datasourceId: 'datasourceId2' },
        ],
      },
    };

    api.addDatasourceDashboardMaps([
      { dashboardId: 'dashboardId1', datasourceId: 'datasourceId1' },
      { dashboardId: 'dashboardId2', datasourceId: 'datasourceId2' },
    ]);

    expect(uploadData).toHaveBeenCalledWith(expectedParameter);
  });

  it('should call delete datasource and dashboard map', () => {
    const expectedParameter = {
      url: '/api/dashboard-datasource-map',
      method: 'delete',
      data: { dashboardId: 'dashboardId1', datasourceId: 'datasourceId1' },
    };

    api.removeDatasourceDashboardMaps({
      dashboardId: 'dashboardId1',
      datasourceId: 'datasourceId1',
    });

    expect(uploadData).toHaveBeenCalledWith(expectedParameter);
  });

  it('should call add column api to add new custom column', () => {
    const expectedParameter = {
      url: '/api/dataSources/datasourceId1/column',
      method: 'put',
      data: { columnName: 'col1', expression: '1 + 10' },
    };

    api.addColumn('datasourceId1', '1 + 10', 'col1');

    expect(uploadData).toHaveBeenCalledWith(expectedParameter);
  });

  it('should call delete column', () => {
    const expectedParameter = {
      url: '/api/dataSources/datasourceId1/column',
      method: 'delete',
      data: { columnName: 'col1' },
    };

    api.deleteColumn({ datasourceId: 'datasourceId1', columnName: 'col1' });

    expect(uploadData).toHaveBeenCalledWith(expectedParameter);
  });

  it('should call get metadata for datasource', () => {
    const expectedParameter = {
      url: '/api/dataSources/datasourceId/metadata',
    };

    api.getDataSourceMetaData('datasourceId');

    expect(fetchData).toHaveBeenCalledWith(expectedParameter);
  });
});
