const mongoose = require('mongoose');
const fs = require('fs');

const dataSourceMetadataRepository = require('../../src/repository/datasourceMetadataRepository');
const dashboardDatasourceMapRepository = require('../../src/repository/dashboardDatasourceMapRepository');
const dataSourceRepository = require('../../src/repository/datasourceRepository');
const uploadDatasourceService = require('../../src/services/uploadDatasourceService');
const datasourceService = require('../../src/services/datasourceService');

const createModel = require('../../src/utils/modelCreator');

const InvalidInputException = require('../../src/exceptions/InvalidInputException');

jest.mock('fs');
jest.mock('../../src/repository/datasourceMetadataRepository');
jest.mock('../../src/repository/dashboardDatasourceMapRepository');
jest.mock('../../src/repository/datasourceRepository');
jest.mock('../../src/utils/modelCreator');
jest.mock('../../src/services/datasourceService');
jest.mock('../../src/utils/csvParser', () => ({
  validateAndParseCSV: jest.fn().mockReturnValue([
    { hour: 0, susceptible: 1 },
    { hour: 1, susceptible: 2 },
    { hour: 2, susceptible: 3 },
  ]),
}));

describe('upload datasource service', () => {
  describe('Upload datasource metadata', () => {
    it('should return id for uploaded dataSource metadata for uploaded csv', async () => {
      dataSourceMetadataRepository.insert.mockResolvedValue({ _id: 'collection' });

      const collectionId = await uploadDatasourceService.uploadFile(
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

      await uploadDatasourceService.uploadFile(
        {
          path: '/uploads/1223',
          originalname: 'test.csv',
          mimetype: 'text/csv',
          size: 12132,
          filename: 'fileId',
        },
        { schema: '{ "hour": "number", "susceptible": "number" }', dashboardId: 'dashboardId' },
      );

      expect(dataSourceMetadataRepository.insert).toHaveBeenCalledWith({
        dataSourceSchema: { hour: 'number', susceptible: 'number' },
        name: 'test.csv',
        dashboardId: 'dashboardId',
        fileSize: 12132,
        fileType: 'csv',
        fileId: '',
      });
    });

    it('should insert csv data in data source collection', async () => {
      dataSourceMetadataRepository.insert.mockResolvedValue({ _id: 'collectionId' });
      createModel.getOrCreateModel.mockImplementation((id) => id);

      await uploadDatasourceService.uploadFile(
        {
          path: '/uploads/1223',
          originalname: 'test.csv',
          mimetype: 'text/csv',
          size: 12132,
          filename: 'fileId',
        },
        { schema: '{ "hour": "number", "susceptible": "number" }', dashboardId: 'dashboardId' },
      );

      expect(dashboardDatasourceMapRepository.insertDatasourceDashboardMap).toHaveBeenCalledWith(
        'collectionId',
        'dashboardId',
      );
    });
    it('should upload json data in upload folder', async () => {
      dataSourceMetadataRepository.insert.mockResolvedValue({ _id: 'collectionId' });
      const result = await uploadDatasourceService.uploadFile(
        {
          path: '/uploads/1223',
          originalname: 'test.json',
          size: 12132,
          filename: 'fileId',
        },
        { dashboardId: 'dashboardId' },
      );
      expect(result).toEqual({ collectionId: 'collectionId' });
    });

    it('should upload geoJson data in upload folder with properties as schema in metadata', async () => {
      datasourceService.getJsonData.mockReturnValue({
        data: {
          type: 'featureCollection',
          features: [{ properties: { name: 'propertyName', id: 'propertyId' } }],
        },
      });
      dataSourceMetadataRepository.insert.mockResolvedValue({ _id: 'collectionId' });

      const result = await uploadDatasourceService.uploadFile(
        {
          path: '/uploads/1223',
          originalname: 'test.geojson',
          size: 12132,
          filename: 'fileId',
        },
        { dashboardId: 'dashboardId' },
      );
      const expectedMetadata = {
        dashboardId: 'dashboardId',
        dataSourceSchema: {
          id: 'string',
          name: 'string',
        },
        fileId: 'fileId',
        fileSize: 12132,
        fileType: 'geojson',
        name: 'test.geojson',
      };
      expect(result).toEqual({ collectionId: 'collectionId' });
      expect(dataSourceMetadataRepository.insert).toHaveBeenCalledWith(expectedMetadata);
    });
    it('should upload geoJson data in upload folder with properties schema as {} if geojson is not proper', async () => {
      datasourceService.getJsonData.mockReturnValue({
        data: {
          type: 'wrongGeojson',
          features: [],
        },
      });

      dataSourceMetadataRepository.insert.mockResolvedValue({ _id: 'collectionId' });

      const result = await uploadDatasourceService.uploadFile(
        {
          path: '/uploads/1223',
          originalname: 'test.geojson',
          size: 12132,
          filename: 'fileId',
        },
        { dashboardId: 'dashboardId' },
      );
      const expectedMetadata = {
        dashboardId: 'dashboardId',
        dataSourceSchema: {},
        fileId: 'fileId',
        fileSize: 12132,
        fileType: 'geojson',
        name: 'test.geojson',
      };
      expect(result).toEqual({ collectionId: 'collectionId' });
      expect(dataSourceMetadataRepository.insert).toHaveBeenCalledWith(expectedMetadata);
    });

    it('should insert dashboard and datashource mapping in datasourceDashboardMap', async () => {
      dataSourceMetadataRepository.insert.mockResolvedValue({ _id: 'collectionId' });
      createModel.getOrCreateModel.mockImplementation((id) => id);

      await uploadDatasourceService.uploadFile(
        {
          path: '/uploads/1223',
          originalname: 'test.csv',
          mimetype: 'text/csv',
          size: 12132,
          filename: 'fileId',
        },
        { schema: '{ "hour": "number", "susceptible": "number" }', dashboardId: 'dashboardId' },
      );

      expect(dataSourceRepository.bulkInsert).toHaveBeenCalledWith('collectionId', [
        { hour: 0, susceptible: 1 },
        { hour: 1, susceptible: 2 },
        { hour: 2, susceptible: 3 },
      ]);
    });

    it('should throw invalid input exception if we get exception while uploading', async () => {
      dataSourceMetadataRepository.insert.mockResolvedValue({ _id: 'collectionId' });
      dataSourceRepository.bulkInsert.mockImplementationOnce(() => {
        throw new Error();
      });
      createModel.getOrCreateModel.mockImplementation((id) => id);

      const result = async () => {
        await uploadDatasourceService.uploadFile(
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

    it('should delete metadata added in database if csv data insertion failed', async () => {
      dataSourceMetadataRepository.insert.mockResolvedValue({ _id: 'collectionId' });
      dataSourceRepository.insert.mockImplementationOnce(() => {
        throw new Error();
      });
      createModel.getOrCreateModel.mockImplementation((id) => id);

      try {
        await uploadDatasourceService.uploadFile(
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

    it('should throw exception is file is too large', async () => {
      dataSourceMetadataRepository.insert.mockResolvedValue({ _id: 'collectionId' });
      dataSourceRepository.insert.mockImplementationOnce(() => {
        throw new Error();
      });
      createModel.getOrCreateModel.mockImplementation((id) => id);

      const result = async () => {
        await uploadDatasourceService.uploadFile(
          {
            path: '/uploads/1223',
            originalname: 'test.csv',
            mimetype: 'text/csv',
            size: 314572805,
          },
          { schema: '{ "hour": "number", "susceptible": "number" }', dashboardId: 'dashboardId' },
        );
      };

      await expect(result).rejects.toThrow(new InvalidInputException('File is too large', 1009));
    });

    it('should throw exception is file is not csv', async () => {
      dataSourceMetadataRepository.insert.mockResolvedValue({ _id: 'collectionId' });
      dataSourceRepository.insert.mockImplementationOnce(() => {
        throw new Error();
      });
      createModel.getOrCreateModel.mockImplementation((id) => id);

      const result = async () => {
        await uploadDatasourceService.uploadFile(
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

  describe('deleteUploadedFile', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should delete file for given path', () => {
      fs.existsSync.mockReturnValue(true);

      uploadDatasourceService.deleteUploadedFile('path');

      expect(fs.rmdirSync).toHaveBeenCalledWith('path', { recursive: true });
    });

    it('should not delete file if given path not exist', () => {
      fs.existsSync.mockReturnValue(false);

      uploadDatasourceService.deleteUploadedFile('path');

      expect(fs.rmdirSync).not.toHaveBeenCalled();
    });
  });
});
