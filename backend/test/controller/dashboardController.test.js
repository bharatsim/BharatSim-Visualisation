const express = require('express');
const multer = require('multer');
const request = require('supertest');

const dashboardRoutes = require('../../src/controller/dashboardController');
const dashboardService = require('../../src/services/dashboardService');
const InvalidInputException = require('../../src/exceptions/InvalidInputException');

jest.mock('../../src/services/dashboardService');

const TEST_FILE_UPLOAD_PATH = './test/testUpload/';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer({ dest: TEST_FILE_UPLOAD_PATH }).single('datafile'));
app.use('/dashboard', dashboardRoutes);

describe('dashboardController', () => {
  describe('Post /', () => {
    it('should save dashboard data into database', async () => {
      dashboardService.saveDashboard.mockResolvedValue({ dashboardId: '_id' });
      await request(app).post('/dashboard/').send({ dashboardData: 'Data' }).expect(200);

      expect(dashboardService.saveDashboard).toHaveBeenCalledWith('Data');
    });
    it('should save dashboard data into database and return the id', async () => {
      dashboardService.saveDashboard.mockResolvedValue({ dashboardId: '_id' });

      await request(app)
        .post('/dashboard/')
        .send({ dashboardData: 'Data' })
        .expect(200)
        .expect({ dashboardId: '_id' });
    });
    it('should throw invalid input exception while saving invalid data', async () => {
      dashboardService.saveDashboard.mockRejectedValue(
        new InvalidInputException('Message', '12123'),
      );

      await request(app)
        .post('/dashboard/')
        .send({ dashboardData: 'Data' })
        .expect(400)
        .expect({ errorMessage: 'Invalid Input - Message', errorCode: '12123' });
    });
    it('should throw technical error for technical failure', async () => {
      dashboardService.saveDashboard.mockRejectedValue(new Error('Message'));

      await request(app)
        .post('/dashboard/')
        .send({ dashboardData: 'Data' })
        .expect(500)
        .expect({ errorMessage: 'Technical error Message', errorCode: 1003 });
    });
  });

  describe('Post /create-new', () => {
    it('should insert new dashboard', async () => {
      dashboardService.insertDashboard.mockResolvedValue({ dashboardId: '_id' });
      await request(app).post('/dashboard/create-new').send({ dashboardData: 'Data' }).expect(200);

      expect(dashboardService.insertDashboard).toHaveBeenCalledWith('Data');
    });

    it('should throw invalid input exception while inserting invalid data', async () => {
      dashboardService.insertDashboard.mockRejectedValue(
        new InvalidInputException('Message', '12123'),
      );

      await request(app)
        .post('/dashboard/create-new')
        .send({ dashboardData: 'Data' })
        .expect(400)
        .expect({ errorMessage: 'Invalid Input - Message', errorCode: '12123' });
    });
    it('should throw technical error for technical failure', async () => {
      dashboardService.insertDashboard.mockRejectedValue(new Error('Message'));

      await request(app)
        .post('/dashboard/create-new')
        .send({ dashboardData: 'Data' })
        .expect(500)
        .expect({ errorMessage: 'Technical error Message', errorCode: 1003 });
    });
  });

  describe('Get /dashboard/', () => {
    it('should geta all dashboard ', async () => {
      dashboardService.getAllDashboards.mockResolvedValueOnce({ dashboards: {} });

      await request(app).get('/dashboard/').expect(200);

      expect(dashboardService.getAllDashboards).toHaveBeenCalledWith({}, undefined);
    });

    it('should get dashboard data by project id filter', async () => {
      dashboardService.getAllDashboards.mockResolvedValueOnce({ dashboards: {} });
      await request(app).get('/dashboard?projectId=5f75ce5999399c14af5a2845').expect(200);

      expect(dashboardService.getAllDashboards).toHaveBeenCalledWith(
        { projectId: '5f75ce5999399c14af5a2845' },
        undefined,
      );
    });

    it('should get dashboard data with projected columns and filter', async () => {
      dashboardService.getAllDashboards.mockResolvedValueOnce({ dashboards: {} });
      await request(app)
        .get('/dashboard?projectId=5f75ce5999399c14af5a2845&columns[]=name&&columns[]=_id')
        .expect(200);

      expect(dashboardService.getAllDashboards).toHaveBeenCalledWith(
        { projectId: '5f75ce5999399c14af5a2845' },
        ['name', '_id'],
      );
    });
    it('should get dashboard data with dashboard data', async () => {
      dashboardService.getDashboard.mockResolvedValueOnce({ dashboard: 'dashboardData' });
      await request(app).get('/dashboard/dashboardId').expect(200);

      expect(dashboardService.getDashboard).toHaveBeenCalledWith('dashboardId');
    });
    it('should throw and technical error for any failure for get dashboard with Id', async () => {
      dashboardService.getDashboard.mockRejectedValueOnce(new Error('Message'));
      await request(app)
        .get('/dashboard/dashboardId')
        .expect(500)
        .expect({ errorMessage: 'Technical error Message', errorCode: 1003 });
    });

    it('should throw and technical error for any failure', async () => {
      dashboardService.getAllDashboards.mockRejectedValueOnce(new Error('Message'));
      await request(app)
        .get('/dashboard/')
        .expect(500)
        .expect({ errorMessage: 'Technical error Message', errorCode: 1003 });
    });
  });
  describe('delete /dashboard', () => {
    it('should delete dashboard with given dashboard id', async () => {
      dashboardService.deleteDashboardAndMapping.mockResolvedValueOnce({
        deletedCount: 1,
        mappingDeletedCount: 1,
      });
      await request(app).delete('/dashboard/dashboardId').expect(200).expect({
        deletedCount: 1,
        mappingDeletedCount: 1,
      });

      expect(dashboardService.deleteDashboardAndMapping).toHaveBeenCalledWith('dashboardId');
    });
    it('should throw error if any while deleting the dashboard', async () => {
      dashboardService.deleteDashboardAndMapping.mockRejectedValueOnce(new Error('Message'));
      await request(app)
        .delete('/dashboard/dashboardId')
        .expect(500)
        .expect({ errorMessage: 'Technical error Message', errorCode: 1003 });

      expect(dashboardService.deleteDashboardAndMapping).toHaveBeenCalledWith('dashboardId');
    });
  });
});
