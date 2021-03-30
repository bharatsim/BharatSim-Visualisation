const express = require('express');
const request = require('supertest');

const datasourceDashboardMapRoutes = require('../../src/controller/datasourceDashboardMapController');
const datasourceDashboardMapService = require('../../src/services/datasourceDashboardMapService');

jest.mock('../../src/services/datasourceDashboardMapService');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/datasource-dashboard-map', datasourceDashboardMapRoutes);

describe('datasourceDashboardMapController', () => {
  describe('POST /', () => {
    it('should add datasource dashboard maps', async () => {
      datasourceDashboardMapService.addDatasourceDashboardMaps.mockResolvedValue({ added: 1 });
      await request(app)
        .post('/datasource-dashboard-map')
        .send({
          datasourceDashboardMaps: [
            {
              dashboardId: 'dashboardId',
              datasourceId: 'datasourceId',
            },
          ],
        })
        .expect(200)
        .expect({ added: 1 });
      expect(datasourceDashboardMapService.addDatasourceDashboardMaps).toHaveBeenCalledWith([
        {
          dashboardId: 'dashboardId',
          datasourceId: 'datasourceId',
        },
      ]);
    });
    it('should throw technical error if it fails to add maps', async () => {
      datasourceDashboardMapService.addDatasourceDashboardMaps.mockRejectedValueOnce(
        new Error('Message'),
      );
      await request(app)
        .post('/datasource-dashboard-map')
        .send({
          datasourceDashboardMaps: [
            {
              dashboardId: 'dashboardId',
              datasourceId: 'datasourceId',
            },
          ],
        })
        .expect(500)
        .expect({ errorMessage: 'Technical error Message', errorCode: 1003 });
    });
  });
  describe('Delete /', () => {
    it('should add datasource dashboard maps', async () => {
      datasourceDashboardMapService.deleteDatasourceDashboardMap.mockResolvedValue({
        deletedCount: 1,
      });
      await request(app)
        .delete('/datasource-dashboard-map')
        .send({
          dashboardId: 'dashboardId',
          datasourceId: 'datasourceId',
        })
        .expect(200)
        .expect({ deletedCount: 1 });
      expect(datasourceDashboardMapService.deleteDatasourceDashboardMap).toHaveBeenCalledWith({
        dashboardId: 'dashboardId',
        datasourceId: 'datasourceId',
      });
    });
    it('should throw technical error if it fails to delete map', async () => {
      datasourceDashboardMapService.deleteDatasourceDashboardMap.mockRejectedValueOnce(
        new Error('Message'),
      );
      await request(app)
        .delete('/datasource-dashboard-map')
        .send({
          dashboardId: 'dashboardId',
          datasourceId: 'datasourceId',
        })
        .expect(500)
        .expect({ errorMessage: 'Technical error Message', errorCode: 1003 });
    });
  });
});
