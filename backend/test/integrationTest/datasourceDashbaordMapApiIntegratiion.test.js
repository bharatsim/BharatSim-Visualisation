const express = require('express');
const request = require('supertest');
const datasourceDashboardMapRoutes = require('../../src/controller/datasourceDashboardMapController');
const dbHandler = require('../db-handler');
const DatasourceDashboardMap = require('../../src/model/datasourceDashboardMap');
const { parseDBObject } = require('../../src/utils/dbUtils');

describe('datasourceDashboardMapIntegration', () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/datasource-dashboard-map', datasourceDashboardMapRoutes);

  beforeAll(async () => {
    await dbHandler.connect();
  });
  afterEach(async () => {
    await dbHandler.clearDatabase();
  });
  afterAll(async () => {
    await dbHandler.clearDatabase();
    await dbHandler.closeDatabase();
  });

  it('should add datasource dashboard mapping', async () => {
    const inputBody = {
      datasourceDashboardMaps: [
        {
          datasourceId: '113233343536373839303137',
          dashboardId: '213233343536373839303137',
        },
      ],
    };
    await request(app)
      .post('/datasource-dashboard-map')
      .send(inputBody)
      .expect(200)
      .expect({ added: 1 });

    const addedMap = await DatasourceDashboardMap.findOne(
      {
        datasourceId: '113233343536373839303137',
        dashboardId: '213233343536373839303137',
      },
      { __v: 0, _id: 0 },
    );

    expect(parseDBObject(addedMap)).toEqual({
      datasourceId: '113233343536373839303137',
      dashboardId: '213233343536373839303137',
    });
  });
  it('should delete datasource mapping for given dashboard and datasource id', async () => {
    await DatasourceDashboardMap.insertMany([
      {
        datasourceId: '113233343536373839303137',
        dashboardId: '213233343536373839303137',
      },
      {
        datasourceId: '113233343536373839303138',
        dashboardId: '213233343536373839303139',
      },
    ]);
    const allMaps = await DatasourceDashboardMap.find({});
    expect(allMaps.length).toEqual(2);

    const inputBody = {
      datasourceId: '113233343536373839303137',
      dashboardId: '213233343536373839303137',
    };
    await request(app)
      .delete('/datasource-dashboard-map')
      .send(inputBody)
      .expect(200)
      .expect({ n: 1, ok: 1, deletedCount: 1 });

    const mapsAfterDelete = await DatasourceDashboardMap.find({});
    expect(mapsAfterDelete.length).toEqual(1);
  });
});
