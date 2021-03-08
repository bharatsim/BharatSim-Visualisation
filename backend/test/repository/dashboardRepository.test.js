const Dashboard = require('../../src/model/dashboard');
const DashboardRepository = require('../../src/repository/dashboardRepository');

const parseMongoDBResult = (result) => JSON.parse(JSON.stringify(result));

const dbHandler = require('../db-handler');

const chart = {
  config: { xAxis: 'xCol', yAxis: 'ycol' },
  dataSource: 'datasource',
  layout: { h: 1, i: 'test', w: 2, x: 1, y: null },
  chartType: 'chartType',
  dataSourceIds: ['datasource'],
};

const dashboard = {
  name: 'dashboard1',
  charts: [chart],
  layout: [],
  count: 0,
  projectId: '313233343536373839303133',
};

describe('DashboardRepository', function () {
  beforeAll(async () => {
    await dbHandler.connect();
  });
  afterEach(async () => {
    await dbHandler.clearDatabase();
  });
  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  it('should insert dashboard data into database', async function () {
    const { _id } = await DashboardRepository.insert(dashboard);

    expect(parseMongoDBResult(await Dashboard.findOne({ _id }, { __v: 0, _id: 0 }))).toEqual({
      name: 'dashboard1',
      charts: [
        {
          config: { xAxis: 'xCol', yAxis: 'ycol' },
          dataSource: 'datasource',
          layout: { h: 1, i: 'test', w: 2, x: 1, y: null },
          chartType: 'chartType',
          dataSourceIds: ['datasource'],
        },
      ],
      layout: [],
      count: 0,
      projectId: '313233343536373839303133',
    });
  });
  it('should update dashboard data into database', async function () {
    const { _id } = await DashboardRepository.insert(dashboard);
    const newData = { ...dashboard, name: 'newName' };

    await DashboardRepository.update(_id, newData);

    expect(parseMongoDBResult(await Dashboard.findOne({ _id }, { __v: 0, _id: 0 }))).toEqual({
      name: 'newName',
      charts: [
        {
          config: { xAxis: 'xCol', yAxis: 'ycol' },
          dataSource: 'datasource',
          layout: { h: 1, i: 'test', w: 2, x: 1, y: null },
          chartType: 'chartType',
          dataSourceIds: ['datasource'],
        },
      ],
      layout: [],
      projectId: '313233343536373839303133',
      count: 0,
    });
  });
  it('should fetch all the uploaded dashboards from database', async function () {
    await DashboardRepository.insert(dashboard);
    await DashboardRepository.insert(dashboard);

    const data = parseMongoDBResult(await DashboardRepository.getAll());

    expect(data.length).toEqual(2);
  });

  it('should fetch all the dashboards by projectId with projected column', async function () {
    const { _id: dash1 } = await DashboardRepository.insert(dashboard);
    const { _id: dash2 } = await DashboardRepository.insert(dashboard);
    const { _id: dash3 } = await DashboardRepository.insert(dashboard);
    await DashboardRepository.insert({
      ...dashboard,
      projectId: '313233343536373839303137',
    });

    const data = parseMongoDBResult(
      await DashboardRepository.getAll(
        { projectId: '313233343536373839303133' },
        { name: 1, _id: 1 },
      ),
    );

    expect(parseMongoDBResult(data)).toEqual([
      { _id: dash1.toString(), name: 'dashboard1' },
      { _id: dash2.toString(), name: 'dashboard1' },
      { _id: dash3.toString(), name: 'dashboard1' },
    ]);
  });
  it('should fetch dashboard with given dashboard id', async () => {
    const { _id: dash1 } = await DashboardRepository.insert(dashboard);
    await DashboardRepository.insert(dashboard);
    await DashboardRepository.insert(dashboard);
    await DashboardRepository.insert({
      ...dashboard,
      projectId: '313233343536373839303137',
    });

    const data = parseMongoDBResult(await DashboardRepository.getOne(dash1));

    expect(parseMongoDBResult(data)).toEqual({
      _id: dash1.toString(),
      charts: [
        {
          chartType: 'chartType',
          dataSourceIds: ['datasource'],
          config: { xAxis: 'xCol', yAxis: 'ycol' },
          dataSource: 'datasource',
          layout: { h: 1, i: 'test', w: 2, x: 1, y: null },
        },
      ],
      count: 0,
      layout: [],
      name: 'dashboard1',
      projectId: '313233343536373839303133',
    });
  });
  it('should delete dashboard with given dashboard id', async () => {
    const { _id: dash1 } = await DashboardRepository.insert(dashboard);
    await DashboardRepository.insert(dashboard);
    await DashboardRepository.insert(dashboard);
    await DashboardRepository.insert({
      ...dashboard,
      projectId: '313233343536373839303137',
    });

    const data = parseMongoDBResult(await DashboardRepository.deleteOne(dash1));

    expect(parseMongoDBResult(data)).toEqual({
      deletedCount: 1,
      n: 1,
      ok: 1,
    });
  });

  it('should get count of widgets for given filter', async () => {
    await DashboardRepository.insert(dashboard);

    const queryObject = { 'charts.dataSource': 'datasource' };

    const count = await DashboardRepository.getCount(queryObject);
    expect(count).toEqual(1);
  });
});
