const express = require('express');
const request = require('supertest');
const multer = require('multer');

const dbHandler = require('../db-handler');
const datasourcesRoutes = require('../../src/controller/datasourcesController');
const dashboardRoutes = require('../../src/controller/dashboardController');
const dashboardModel = require('../../src/model/dashboard');

const DatasourceDashboardMap = require('../../src/model/datasourceDashboardMap');
const { parseDBObject } = require('../../src/utils/dbUtils');

const TEST_FOLDER_EXTENSION = 'dashboard';

const chart = {
  layout: { h: 1, i: 'test', w: 2, x: 1, y: 3 },
  dataSource: 'datasource',
  config: { xAxis: 'xCol', yAxis: 'ycol' },
  chartType: 'chartType',
  dataSourceIds: ['datasource'],
};
const dashboardData = {
  name: 'dashboard1',
  charts: [chart],
  layout: [],
  count: 0,
  notes: '',
  projectId: '313233343536373839303132',
};

describe('Integration test for dashboard api', () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    multer({ dest: `${dbHandler.TEST_FILE_UPLOAD_PATH}-${TEST_FOLDER_EXTENSION}` }).single(
      'datafile',
    ),
  );
  app.use('/datasources', datasourcesRoutes);
  app.use('/dashboard', dashboardRoutes);
  beforeAll(async () => {
    await dbHandler.connect();
  });
  afterEach(async () => {
    await dbHandler.clearDatabase();
  });
  afterAll(async () => {
    await dbHandler.clearDatabase();
    await dbHandler.closeDatabase();
    dbHandler.clearTestUpload(TEST_FOLDER_EXTENSION);
  });
  describe('POST /dashboard', () => {
    it('should save dashboard to database', async () => {
      const response = await request(app).post('/dashboard').send({ dashboardData }).expect(200);
      const { dashboardId } = response.body;
      const dashboardRow = parseDBObject(
        await dashboardModel.findOne({ _id: dashboardId }, { __v: 0, _id: 0 }),
      );
      expect(dashboardRow).toEqual(dashboardData);
    });
  });

  describe('POST /dashboard/creat-new', () => {
    it('should save dashboard to database', async () => {
      const response = await request(app)
        .post('/dashboard/create-new')
        .send({ dashboardData })
        .expect(200);
      const { dashboardId } = response.body;
      const dashboardRow = parseDBObject(
        await dashboardModel.findOne({ _id: dashboardId }, { __v: 0, _id: 0 }),
      );
      expect(dashboardRow).toEqual(dashboardData);
    });
  });

  describe('Get /dashboard', () => {
    it('should get all dashboards from database', async () => {
      dashboardModel.insertMany([dashboardData]);
      const response = await request(app).get('/dashboard').expect(200);
      expect(response.body.dashboards.length).toEqual(1);
    });
  });
  describe('Get /dashboard', () => {
    it('should get all dashboards from database', async () => {
      dashboardModel.insertMany([dashboardData]);
      const response = await request(app).get('/dashboard').expect(200);
      expect(response.body.dashboards.length).toEqual(1);
    });
  });
  describe('Delete /dashboard:id', () => {
    it('should delete dashboard from database for given id along  with its mapping', async () => {
      const insertedData = await dashboardModel.insertMany([dashboardData]);
      const { _id: dashboardId } = insertedData[0];

      await DatasourceDashboardMap.insertMany([
        {
          dashboardId,
          datasourceId: '313233343536373839303131',
        },
        {
          dashboardId,
          datasourceId: '313233343536373839303132',
        },
      ]);
      const foundMapping = parseDBObject(
        await DatasourceDashboardMap.find({
          dashboardId: '313233343536373839303131',
        }),
      );
      const response = await request(app)
        .delete(`/dashboard/${dashboardId.toString()}`)
        .expect(200);
      expect(response.body).toEqual({ deletedCount: 1, mappingDeletedCount: 2 });
      expect(foundMapping).toEqual([]);
    });
  });
});
