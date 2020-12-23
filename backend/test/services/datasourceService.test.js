const fs = require('fs');
const dataSourceService = require('../../src/services/datasourceService');
const dataSourceRepository = require('../../src/repository/datasourceRepository');
const dataSourceMetadataRepository = require('../../src/repository/datasourceMetadataRepository');
const dashboardDatasourceMapRepository = require('../../src/repository/dashboardDatasourceMapRepository');
const modelCreator = require('../../src/utils/modelCreator');
const ColumnsNotFoundException = require('../../src/exceptions/ColumnsNotFoundException');
const DatasourceNotFoundException = require('../../src/exceptions/DatasourceNotFoundException');

jest.mock('../../src/repository/dataSourceRepository');
jest.mock('../../src/repository/dataSourceMetadataRepository');
jest.mock('../../src/repository/dashboardDatasourceMapRepository');
jest.mock('../../src/utils/modelCreator');
jest.mock('../../src/services/dashboardService');

jest.spyOn(fs, 'readFileSync');
jest.spyOn(fs, 'existsSync');
jest.spyOn(fs, 'rmdirSync');

describe('dataSourceService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should fetch data from database for give datasource name', async () => {
    dataSourceMetadataRepository.getDataSourceSchemaById.mockResolvedValueOnce('DataSourceSchema');
    dataSourceMetadataRepository.getDatasourceMetadataForDatasourceId.mockResolvedValueOnce({
      fileType: 'csv',
    });
    modelCreator.createModel.mockReturnValue('DataSourceModel');
    dataSourceRepository.getData.mockResolvedValue([
      { hour: 1, susceptible: 99 },
      { hour: 2, susceptible: 98 },
      { hour: 3, susceptible: 97 },
    ]);

    const dataSourceID = 'model';

    const data = await dataSourceService.getData(dataSourceID);

    expect(data).toEqual({
      data: {
        hour: [1, 2, 3],
        susceptible: [99, 98, 97],
      },
    });
  });

  it('should fetch data from database for give datasource name and selected columns only', async () => {
    dataSourceMetadataRepository.getDataSourceSchemaById.mockResolvedValue({
      dataSourceSchema: 'DataSourceSchema',
    });
    dataSourceMetadataRepository.getDatasourceMetadataForDatasourceId.mockResolvedValueOnce({
      fileType: 'csv',
    });
    dataSourceRepository.getData.mockResolvedValue([{ hour: 1 }, { hour: 2 }, { hour: 3 }]);
    modelCreator.createModel.mockReturnValue('DataSourceModel');
    const dataSourceID = 'model';

    const data = await dataSourceService.getData(dataSourceID, ['hour']);

    expect(dataSourceMetadataRepository.getDataSourceSchemaById).toHaveBeenCalledWith('model');
    expect(dataSourceRepository.getData).toHaveBeenCalledWith('DataSourceModel', { hour: 1 });
    expect(modelCreator.createModel).toHaveBeenCalledWith('model', 'DataSourceSchema');
    expect(data).toEqual({
      data: { hour: [1, 2, 3] },
    });
  });
  it('should fetch data from file server for given json or extended json file', async () => {
    fs.existsSync.mockReturnValueOnce(true);
    fs.readFileSync.mockReturnValueOnce(JSON.stringify([{ hour: 1 }, { hour: 2 }, { hour: 3 }]));
    dataSourceMetadataRepository.getDatasourceMetadataForDatasourceId.mockResolvedValueOnce({
      fileType: 'json',
      fileId: 'multerFileId',
    });
    const dataSourceID = 'model';
    const data = await dataSourceService.getData(dataSourceID);
    expect(data).toEqual([{ hour: 1 }, { hour: 2 }, { hour: 3 }]);
  });
  it('should throw exception for datasource not found if file is present', async () => {
    fs.existsSync.mockReturnValueOnce(false);
    dataSourceMetadataRepository.getDatasourceMetadataForDatasourceId.mockResolvedValueOnce({
      fileType: 'json',
      fileId: 'multerFileId',
    });
    const result = async () => {
      await dataSourceService.getData('dataSourceID');
    };
    await expect(result).rejects.toThrow(new DatasourceNotFoundException('multerFileId'));
  });
  it('should throw exception for datasource not found file is not supported format', async () => {
    dataSourceMetadataRepository.getDatasourceMetadataForDatasourceId.mockResolvedValueOnce({
      fileId: 'multerFileId',
    });
    const result = async () => {
      await dataSourceService.getData('dataSourceID');
    };
    await expect(result).rejects.toThrow(new DatasourceNotFoundException('multerFileId'));
  });

  it('should throw exception for datasource not found if metadata is not present', async () => {
    dataSourceMetadataRepository.getDatasourceMetadataForDatasourceId.mockResolvedValueOnce(null);
    const result = async () => {
      await dataSourceService.getData('dataSourceID');
    };
    await expect(result).rejects.toThrow(new DatasourceNotFoundException('dataSourceID'));
  });

  it('should throw an exception for column mismatch', async () => {
    dataSourceMetadataRepository.getDataSourceSchemaById.mockResolvedValue({
      dataSourceSchema: 'DataSourceSchema',
    });
    dataSourceMetadataRepository.getDatasourceMetadataForDatasourceId.mockResolvedValueOnce({
      fileType: 'csv',
    });
    modelCreator.createModel.mockReturnValue('DataSourceModel');
    dataSourceRepository.getData.mockResolvedValue([
      { hour: 1, susceptible: 99, exposed: 90 },
      { hour: 2, susceptible: 98, exposed: 90 },
      { hour: 3, susceptible: 97, exposed: 90 },
    ]);
    const dataSourceId = 'model';

    const result = async () => {
      await dataSourceService.getData(dataSourceId, ['hours', 'exposed']);
    };

    await expect(result).rejects.toThrow(new ColumnsNotFoundException());
  });

  it('should delete all mapped csv datasource for given dashboard id', async () => {
    dataSourceMetadataRepository.bulkDeleteDatasourceMetadata.mockResolvedValue({
      deleted: 1,
    });
    dataSourceMetadataRepository.getDatasourceMetadataForDatasourceId.mockResolvedValueOnce({
      fileType: 'csv',
    });
    dashboardDatasourceMapRepository.deleteDatasourceMapping.mockResolvedValue({ deleted: 1 });
    dashboardDatasourceMapRepository.getDatasourceIdsForDashboard.mockResolvedValueOnce([
      'datasource1',
      'datasource2',
    ]);
    dataSourceRepository.bulkDeleteCsv.mockResolvedValue([true]);
    dataSourceMetadataRepository.filterDatasourceIds.mockResolvedValue([
      { _id: 'datasource1' },
      { _id: 'datasource2' },
    ]);

    const data = await dataSourceService.bulkDeleteDatasource(['datasource1', 'datasource2']);
    expect(dataSourceRepository.bulkDeleteCsv).toHaveBeenCalledWith(['datasource1', 'datasource2']);
    expect(dataSourceMetadataRepository.bulkDeleteDatasourceMetadata).toHaveBeenCalledWith([
      'datasource1',
      'datasource2',
    ]);

    expect(data).toEqual({ deleted: 2 });
  });
  describe('mocked function testing', function () {
    beforeEach(async () => {
      jest.clearAllMocks();
      dataSourceMetadataRepository.getDataSourceSchemaById.mockResolvedValue({
        dataSourceSchema: 'DataSourceSchema',
      });
      dataSourceMetadataRepository.getDatasourceMetadataForDatasourceId.mockResolvedValueOnce({
        fileType: 'csv',
      });
      dataSourceRepository.getData.mockResolvedValue([{ hour: 1 }, { hour: 2 }, { hour: 3 }]);
      modelCreator.createModel.mockReturnValue('DataSourceModel');
      const dataSourceId = 'model';
      await dataSourceService.getData(dataSourceId, ['hour']);
    });

    it('should getDataSourceSchema to have been called with dataSource name', function () {
      expect(dataSourceMetadataRepository.getDataSourceSchemaById).toHaveBeenCalledWith('model');
    });

    it('should dataSourceRepository.getData to have been called with created model', function () {
      expect(dataSourceRepository.getData).toHaveBeenCalledWith('DataSourceModel', { hour: 1 });
    });

    it('should createModel to have been called with dataSource name and schema', function () {
      expect(modelCreator.createModel).toHaveBeenCalledWith('model', 'DataSourceSchema');
    });
  });

  describe('should delete all json and extended datasources for given dashboard id', () => {
    beforeEach(async () => {
      fs.existsSync.mockReturnValue(true);
      fs.rmdirSync.mockReturnValueOnce(true);
      dataSourceMetadataRepository.bulkDeleteDatasourceMetadata.mockResolvedValue({
        deleted: 1,
      });
      dataSourceRepository.bulkDeleteCsv.mockResolvedValue([true]);
      dataSourceMetadataRepository.filterDatasourceIds.mockResolvedValue([
        {
          _id: 'datasource1',
          fileId: 'multerId',
          type: 'json',
        },
        { _id: 'datasource2', fileId: 'multerId2', type: 'json' },
      ]);
    });
    it('should delete all the json files present in server', async () => {
      await dataSourceService.bulkDeleteDatasource(['dashboardId']);
      expect(fs.rmdirSync).toHaveBeenCalledTimes(2);
      expect(fs.rmdirSync).toHaveBeenCalledWith('./uploads/multerId', { recursive: true });
      expect(dataSourceMetadataRepository.bulkDeleteDatasourceMetadata).toHaveBeenCalledWith([
        'dashboardId',
      ]);
    });

    it('should should return deleted count', async () => {
      const result = await dataSourceService.bulkDeleteDatasource(['dashboardId']);
      expect(result).toEqual({ deleted: 1 });
    });
  });
});
