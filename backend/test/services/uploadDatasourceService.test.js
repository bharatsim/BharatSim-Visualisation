const mongoose = require('mongoose');
const fs = require('fs');

const dataSourceMetadataRepository = require('../../src/repository/datasourceMetadataRepository');
const dataSourceRepository = require('../../src/repository/datasourceRepository');
const uploadDatasourceService = require('../../src/services/uploadDatasourceService');
const createModel = require('../../src/utils/modelCreator');

const InvalidInputException = require('../../src/exceptions/InvalidInputException');

jest.mock('fs');
jest.mock('../../src/repository/datasourceMetadataRepository');
jest.mock('../../src/repository/datasourceRepository');
jest.mock('../../src/utils/modelCreator');
jest.mock('../../src/utils/csvParser', () => ({
  validateAndParseCSV: jest.fn().mockReturnValue([
    { hour: 0, susceptible: 1 },
    { hour: 1, susceptible: 2 },
    { hour: 2, susceptible: 3 },
  ]),
}));

describe('upload datasource service', function () {
  describe('Upload datasource metadata', function () {
    it('should return id for uploaded dataSource metadata for uploaded csv', async () => {
      dataSourceMetadataRepository.insert.mockResolvedValue({ _id: 'collection' });

      const collectionId = await uploadDatasourceService.uploadCsv(
        {
          path: '/uploads/1223',
          originalname: 'test.csv',
          mimetype: 'text/csv',
          size: 12132,
        },
        { schema: '{ "hour": "number", "susceptible": "number" }', dashboardId: 'dashboardId' },
      );

      expect(collectionId).toEqual({ collectionId: 'collection' });
    });

    it('should insert schema,fileName, dashboardId in dataSource metadata for uploaded csv', async () => {
      dataSourceMetadataRepository.insert.mockResolvedValue({
        _id: new mongoose.Types.ObjectId(123123),
      });

      await uploadDatasourceService.uploadCsv(
        {
          path: '/uploads/1223',
          originalname: 'test.csv',
          mimetype: 'text/csv',
          size: 12132,
        },
        { schema: '{ "hour": "number", "susceptible": "number" }', dashboardId: 'dashboardId' },
      );

      expect(dataSourceMetadataRepository.insert).toHaveBeenCalledWith({
        dataSourceSchema: { hour: 'number', susceptible: 'number' },
        name: 'test.csv',
        dashboardId: 'dashboardId',
        fileSize: 12132,
        fileType: 'text/csv',
      });
    });

    it('should insert data in data source collection', async function () {
      dataSourceMetadataRepository.insert.mockResolvedValue({ _id: 'collectionId' });
      createModel.createModel.mockImplementation((id) => id);

      await uploadDatasourceService.uploadCsv(
        {
          path: '/uploads/1223',
          originalname: 'test.csv',
          mimetype: 'text/csv',
          size: 12132,
        },
        { schema: '{ "hour": "number", "susceptible": "number" }', dashboardId: 'dashboardId' },
      );

      expect(dataSourceRepository.bulkInsert).toHaveBeenCalledWith('collectionId', [
        { hour: 0, susceptible: 1 },
        { hour: 1, susceptible: 2 },
        { hour: 2, susceptible: 3 },
      ]);
    });

    it('should throw invalid input exception if we get exception while uploading', async function () {
      dataSourceMetadataRepository.insert.mockResolvedValue({ _id: 'collectionId' });
      dataSourceRepository.bulkInsert.mockImplementationOnce(() => {
        throw new Error();
      });
      createModel.createModel.mockImplementation((id) => id);

      const result = async () => {
        await uploadDatasourceService.uploadCsv(
          {
            path: '/uploads/1223',
            originalname: 'test.csv',
            mimetype: 'text/csv',
            size: 12132,
          },
          { schema: '{ "hour": "number", "susceptible": "number" }', dashboardId: 'dashboardId' },
        );
      };

      await expect(result).rejects.toThrow(
        new InvalidInputException('Error while uploading csv file with invalid csv data', 1008),
      );
    });

    it('should delete metadata added in database if csv data insertion failed', async function () {
      dataSourceMetadataRepository.insert.mockResolvedValue({ _id: 'collectionId' });
      dataSourceRepository.insert.mockImplementationOnce(() => {
        throw new Error();
      });
      createModel.createModel.mockImplementation((id) => id);

      try {
        await uploadDatasourceService.uploadCsv(
          {
            path: '/uploads/1223',
            originalname: 'test.csv',
            mimetype: 'text/csv',
            size: 12132,
          },
          { schema: '{ "hour": "number", "susceptible": "number" }', dashboardId: 'dashboardId' },
        );
      } catch {
        expect(dataSourceMetadataRepository.deleteDatasourceMetadata).toHaveBeenCalledWith(
          'collectionId',
        );
      }
    });

    it('should throw exception is file is too large', async function () {
      dataSourceMetadataRepository.insert.mockResolvedValue({ _id: 'collectionId' });
      dataSourceRepository.insert.mockImplementationOnce(() => {
        throw new Error();
      });
      createModel.createModel.mockImplementation((id) => id);

      const result = async () => {
        await uploadDatasourceService.uploadCsv(
          {
            path: '/uploads/1223',
            originalname: 'test.csv',
            mimetype: 'text/csv',
            size: 10485761,
          },
          { schema: '{ "hour": "number", "susceptible": "number" }', dashboardId: 'dashboardId' },
        );
      };

      await expect(result).rejects.toThrow(new InvalidInputException('File is too large', 1009));
    });

    it('should throw exception is file is not csv', async function () {
      dataSourceMetadataRepository.insert.mockResolvedValue({ _id: 'collectionId' });
      dataSourceRepository.insert.mockImplementationOnce(() => {
        throw new Error();
      });
      createModel.createModel.mockImplementation((id) => id);

      const result = async () => {
        await uploadDatasourceService.uploadCsv(
          {
            path: '/uploads/1223',
            originalname: 'test.png',
            mimetype: 'img/png',
            size: 10485,
          },
          { schema: '{ "hour": "number", "susceptible": "number" }', dashboardId: 'dashboardId' },
        );
      };

      await expect(result).rejects.toThrow(
        new InvalidInputException('File type does not match', 1010),
      );
    });
  });

  describe('deleteUploadedFile', function () {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should delete file for given path', function () {
      fs.existsSync.mockReturnValue(true);

      uploadDatasourceService.deleteUploadedFile('path');

      expect(fs.rmdirSync).toHaveBeenCalledWith('path', { recursive: true });
    });

    it('should not delete file if given path not exist', function () {
      fs.existsSync.mockReturnValue(false);

      uploadDatasourceService.deleteUploadedFile('path');

      expect(fs.rmdirSync).not.toHaveBeenCalled();
    });
  });
});
