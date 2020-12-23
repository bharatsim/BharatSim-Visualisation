const express = require('express');
const request = require('supertest');
const multer = require('multer');
const fs = require('fs');

const dataSourceMetadataService = require('../../src/services/datasourceMetadataService');
const datasourceService = require('../../src/services/datasourceService');
const uploadDatasourceService = require('../../src/services/uploadDatasourceService');
const dataSourcesRoutes = require('../../src/controller/datasourcesController');
const DataSourceNotFoundException = require('../../src/exceptions/DatasourceNotFoundException');
const ColumnsNotFoundException = require('../../src/exceptions/ColumnsNotFoundException');
const InvalidInputException = require('../../src/exceptions/InvalidInputException');
const NotFoundException = require('../../src/exceptions/NotFoundException');

const TEST_FILE_UPLOAD_PATH = './test/testUpload/';
const testSchema = '{ "col1": "String", "col2": "Number" }';
jest.mock('multer');
jest.mock('../../src/services/dataSourceMetadataService');
jest.mock('../../src/services/dataSourceService');
jest.mock('../../src/services/uploadDatasourceService');

let mockUploadFileName = 'sample.csv';
multer.mockImplementation(() => ({
  single() {
    return (req, res, next) => {
      req.body.schema = testSchema;
      req.body.dashboardId = 'dashboardId';
      req.file = {
        originalname: mockUploadFileName,
        mimetype: 'sample.type',
        path: 'sample.path',
        size: 12312,
      };
      return next();
    };
  },
}));

describe('api', () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(multer({ dest: TEST_FILE_UPLOAD_PATH }).single('datafile'));
  app.use('/datasources', dataSourcesRoutes);

  beforeEach(() => {
    datasourceService.getData.mockResolvedValue({ data: { exposed: [2, 3], hour: [1, 2] } });
    datasourceService.bulkDeleteDatasource.mockResolvedValue({ deleted: 1 });

    dataSourceMetadataService.getHeaders.mockResolvedValue({
      headers: [
        { name: 'hour', type: 'number' },
        { name: 'susceptible', type: 'number' },
      ],
    });
    dataSourceMetadataService.getDataSourcesByDashboardId.mockResolvedValue({
      dataSources: [{ name: 'model_1' }, { name: 'model_2' }],
    });

    uploadDatasourceService.uploadFile.mockResolvedValue({ collectionId: 'id' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    if (fs.existsSync(TEST_FILE_UPLOAD_PATH)) {
      fs.rmdirSync(TEST_FILE_UPLOAD_PATH, { recursive: true });
    }
  });

  describe('Get /datasources/:id/headers', () => {
    it('should get headers', async () => {
      await request(app)
        .get('/datasources/model_1/headers')
        .expect(200)
        .expect({
          headers: [
            { name: 'hour', type: 'number' },
            { name: 'susceptible', type: 'number' },
          ],
        });
      expect(dataSourceMetadataService.getHeaders).toHaveBeenCalledWith('model_1');
    });

    it('should throw error if datasource not found', async () => {
      const dataSourceNotFoundException = new DataSourceNotFoundException('model_1');
      dataSourceMetadataService.getHeaders.mockRejectedValueOnce(dataSourceNotFoundException);
      await request(app).get('/datasources/model_1/headers').expect(404).expect({
        errorMessage: 'datasource with id model_1 not found',
        errorCode: 1002,
      });
      expect(dataSourceMetadataService.getHeaders).toHaveBeenCalledWith('model_1');
    });

    it('should send error for any technical error', async () => {
      dataSourceMetadataService.getHeaders.mockRejectedValueOnce(new Error('error'));

      await request(app)
        .get('/datasources/datasourceName/headers')
        .expect(500)
        .expect({ errorMessage: 'Technical error error', errorCode: 1003 });

      expect(dataSourceMetadataService.getHeaders).toHaveBeenCalledWith('datasourceName');
    });
  });

  describe('Get /datasources/:id', () => {
    it('should get data for specified datasource name', async () => {
      await request(app)
        .get('/datasources/datasourceId')
        .expect(200)
        .expect({ data: { exposed: [2, 3], hour: [1, 2] } });
      expect(datasourceService.getData).toHaveBeenCalledWith('datasourceId', undefined);
    });

    it('should get data for requested columns', async () => {
      await request(app)
        .get('/datasources/datasourceId')
        .query({ columns: ['expose', 'hour'] })
        .expect(200)
        .expect({ data: { exposed: [2, 3], hour: [1, 2] } });
      expect(datasourceService.getData).toHaveBeenCalledWith('datasourceId', ['expose', 'hour']);
    });

    it('should throw error if data source not found', async () => {
      const dataSourceNotFoundException = new DataSourceNotFoundException('datasourceName');
      datasourceService.getData.mockRejectedValueOnce(dataSourceNotFoundException);

      await request(app)
        .get('/datasources/datasourceId')
        .query({ columns: ['expose', 'hour'] })
        .expect(404)
        .expect({
          errorMessage: 'datasource with id datasourceName not found',
          errorCode: 1002,
        });

      expect(datasourceService.getData).toHaveBeenCalledWith('datasourceId', ['expose', 'hour']);
    });

    it('should send error message for columns not found exception', async () => {
      const columnsNotFoundException = new ColumnsNotFoundException();
      datasourceService.getData.mockRejectedValueOnce(columnsNotFoundException);

      await request(app)
        .get('/datasources/datasourceId')
        .query({ columns: ['exposeed', 'hour'] })
        .expect(200)
        .expect({});

      expect(datasourceService.getData).toHaveBeenCalledWith('datasourceId', ['exposeed', 'hour']);
    });

    it('should throw error if any technical error occur', async () => {
      datasourceService.getData.mockRejectedValueOnce(new Error('error'));

      await request(app)
        .get('/datasources/datasourceId')
        .query({ columns: ['expose', 'hour'] })
        .expect(500)
        .expect({ errorMessage: 'Technical error error', errorCode: 1003 });

      expect(datasourceService.getData).toHaveBeenCalledWith('datasourceId', ['expose', 'hour']);
    });
  });

  describe('Get /datasources', () => {
    it('should get data source names', async () => {
      await request(app)
        .get('/datasources?dashboardId=123123')
        .expect(200)
        .expect({ dataSources: [{ name: 'model_1' }, { name: 'model_2' }] });
      expect(dataSourceMetadataService.getDataSourcesByDashboardId).toHaveBeenCalledWith('123123');
    });

    it('should send error message for columns not found exception', async () => {
      dataSourceMetadataService.getDataSourcesByDashboardId.mockRejectedValueOnce(
        new Error('error'),
      );

      await request(app)
        .get('/datasources?dashboardId=123123')
        .expect(500)
        .expect({ errorMessage: 'Technical error error', errorCode: 1003 });

      expect(dataSourceMetadataService.getDataSourcesByDashboardId).toHaveBeenCalled();
    });
  });

  describe('Post /datasources', function () {
    it('should upload file csv successfully', async () => {
      await request(app)
        .post('/datasources')
        .field('schema', JSON.stringify(testSchema))
        .field('name', 'datafile')
        .attach('datafile', 'test/data/simulation.csv')
        .expect(200)
        .expect({ collectionId: 'id' });
      expect(uploadDatasourceService.uploadFile).toHaveBeenCalledWith(
        {
          mimetype: 'sample.type',
          originalname: 'sample.csv',
          path: 'sample.path',
          size: 12312,
        },
        { dashboardId: 'dashboardId', schema: '{ "col1": "String", "col2": "Number" }' },
      );
    });

    it('should delete file after successful upload', async () => {
      await request(app)
        .post('/datasources')
        .field('name', 'datafile')
        .attach('datafile', 'test/data/simulation.csv')
        .expect(200)
        .expect({ collectionId: 'id' });
      expect(uploadDatasourceService.deleteUploadedFile).toHaveBeenCalledWith('sample.path');
    });
    it('should not delete file after successful upload if file is json or extended forms of json', async () => {
      mockUploadFileName = 'sample.json';
      await request(app)
        .post('/datasources')
        .field('name', 'datafile')
        .attach('datafile', 'test/data/simulation.json')
        .expect(200)
        .expect({ collectionId: 'id' });
      expect(uploadDatasourceService.deleteUploadedFile).not.toHaveBeenCalledWith('sample.path');
      mockUploadFileName = 'sample.csv';
    });

    it('should delete file after unsuccessful upload', async () => {
      uploadDatasourceService.uploadFile.mockRejectedValueOnce(new Error());
      await request(app)
        .post('/datasources')
        .field('name', 'datafile')
        .attach('datafile', 'test/data/test.png')
        .expect(500)
        .expect({ errorMessage: 'Technical error ', errorCode: 1003 });

      expect(uploadDatasourceService.deleteUploadedFile).toHaveBeenCalledWith('sample.path');
    });

    it('should throw an invalid input exception for file type not match', async () => {
      const invalidInputError = new InvalidInputException('error message');
      uploadDatasourceService.uploadFile.mockRejectedValueOnce(invalidInputError);
      await request(app)
        .post('/datasources')
        .field('schema', JSON.stringify(testSchema))
        .field('name', 'datafile')
        .attach('datafile', 'test/data/test.png')
        .expect(400)
        .expect({ errorMessage: 'Invalid Input - error message' });

      expect(uploadDatasourceService.uploadFile).toHaveBeenCalledWith(
        {
          mimetype: 'sample.type',
          originalname: 'sample.csv',
          path: 'sample.path',
          size: 12312,
        },
        { dashboardId: 'dashboardId', schema: '{ "col1": "String", "col2": "Number" }' },
      );
    });

    it('should throw an technical exception for file type not match', async () => {
      uploadDatasourceService.uploadFile.mockRejectedValueOnce(new Error());
      await request(app)
        .post('/datasources')
        .field('name', 'datafile')
        .attach('datafile', 'test/data/test.png')
        .expect(500)
        .expect({ errorMessage: 'Technical error ', errorCode: 1003 });
    });
  });
  describe('delete / ', () => {
    it('should delete datasource for given dashboardId', async () => {
      await request(app)
        .delete('/datasources')
        .query({ datasourceIds: ['datasource1', 'datasource2'] })
        .expect(200)
        .expect({ deleted: 1 });

      expect(datasourceService.bulkDeleteDatasource).toHaveBeenCalledWith([
        'datasource1',
        'datasource2',
      ]);
    });

    it('should throw an technical exception if error while deleting', async () => {
      datasourceService.bulkDeleteDatasource.mockRejectedValueOnce(new Error());
      await request(app)
        .delete('/datasources')
        .expect(500)
        .expect({ errorMessage: 'Technical error ', errorCode: 1003 });
    });
    it('should throw an not found exception if id is  not present', async () => {
      datasourceService.bulkDeleteDatasource.mockRejectedValueOnce(
        new NotFoundException('error', 1014),
      );
      await request(app)
        .delete('/datasources')
        .expect(404)
        .expect({ errorMessage: 'Not found - error', errorCode: 1014 });
    });
  });
});
