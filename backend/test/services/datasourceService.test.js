const fs = require('fs');
const datasourceService = require('../../src/services/datasourceService');
const dataSourceRepository = require('../../src/repository/datasourceRepository');
const dataSourceMetadataRepository = require('../../src/repository/datasourceMetadataRepository');
const dashboardDatasourceMapRepository = require('../../src/repository/dashboardDatasourceMapRepository');
const modelCreator = require('../../src/utils/modelCreator');

const ColumnsNotFoundException = require('../../src/exceptions/ColumnsNotFoundException');
const DatasourceNotFoundException = require('../../src/exceptions/DatasourceNotFoundException');
const InvalidInputException = require('../../src/exceptions/InvalidInputException');

jest.mock('../../src/repository/datasourceRepository');
jest.mock('../../src/repository/datasourceMetadataRepository');
jest.mock('../../src/repository/dashboardDatasourceMapRepository');
jest.mock('../../src/utils/modelCreator');
jest.mock('../../src/services/dashboardService');

jest.spyOn(fs, 'readFileSync');
jest.spyOn(fs, 'existsSync');
jest.spyOn(fs, 'rmSync');

describe('datasourceService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should fetch data from database for give datasource name', async () => {
    dataSourceMetadataRepository.getDataSourceSchemaById.mockResolvedValueOnce('DataSourceSchema');
    dataSourceMetadataRepository.getDatasourceMetadataForDatasourceId.mockResolvedValueOnce({
      fileType: 'csv',
    });
    modelCreator.getOrCreateModel.mockReturnValue('DataSourceModel');
    modelCreator.deleteModel.mockReturnValue();
    dataSourceRepository.getData.mockResolvedValue([
      { hour: 1, susceptible: 99 },
      { hour: 2, susceptible: 98 },
      { hour: 3, susceptible: 97 },
    ]);

    const dataSourceID = 'model';

    const data = await datasourceService.getData(dataSourceID);

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
    modelCreator.getOrCreateModel.mockReturnValue('DataSourceModel');
    const dataSourceID = 'model';

    const data = await datasourceService.getData(dataSourceID, ['hour']);

    expect(dataSourceMetadataRepository.getDataSourceSchemaById).toHaveBeenCalledWith('model');
    expect(dataSourceRepository.getData).toHaveBeenCalledWith('DataSourceModel', { hour: 1 }, 0);
    expect(modelCreator.getOrCreateModel).toHaveBeenCalledWith('model', 'DataSourceSchema');
    expect(data).toEqual({
      data: { hour: [1, 2, 3] },
    });
  });
  it('should should fetch data from database for given datasource name and aggregation params only ', async () => {
    dataSourceMetadataRepository.getDataSourceSchemaById.mockResolvedValue({
      dataSourceSchema: 'DataSourceSchema',
    });

    dataSourceMetadataRepository.getDatasourceMetadataForDatasourceId.mockResolvedValueOnce({
      fileType: 'csv',
    });

    dataSourceRepository.getAggregatedData.mockResolvedValue([
      { hour: 1, susceptible: 5 },
      {
        hour: 2,
        susceptible: 4,
      },
      { hour: 3, susceptible: 3 },
    ]);

    modelCreator.getOrCreateModel.mockReturnValue('DataSourceModel');
    const dataSourceID = 'model';
    const aggregationParams = {
      groupBy: ['hour'],
      aggregate: {
        susceptible: 'sum',
      },
    };

    const data = await datasourceService.getData(dataSourceID, undefined, aggregationParams);

    expect(dataSourceMetadataRepository.getDataSourceSchemaById).toHaveBeenCalledWith('model');
    expect(dataSourceRepository.getAggregatedData).toHaveBeenCalledWith(
      'DataSourceModel',
      aggregationParams,
      0,
    );
    expect(modelCreator.getOrCreateModel).toHaveBeenCalledWith('model', 'DataSourceSchema');
    expect(data).toEqual({
      data: { hour: [1, 2, 3], susceptible: [5, 4, 3] },
    });
  });
  it('should fetch data for unquin columns for given datasource id', async () => {
    dataSourceMetadataRepository.getDataSourceSchemaById.mockResolvedValue({
      dataSourceSchema: 'DataSourceSchema',
    });
    dataSourceMetadataRepository.getDatasourceMetadataForDatasourceId.mockResolvedValueOnce({
      fileType: 'csv',
    });
    dataSourceRepository.getData.mockResolvedValue([{ hour: 1 }, { hour: 2 }, { hour: 3 }]);
    modelCreator.getOrCreateModel.mockReturnValue('DataSourceModel');
    const dataSourceID = 'model';

    const data = await datasourceService.getData(dataSourceID, ['hour', 'hour']);

    expect(dataSourceMetadataRepository.getDataSourceSchemaById).toHaveBeenCalledWith('model');
    expect(dataSourceRepository.getData).toHaveBeenCalledWith('DataSourceModel', { hour: 1 }, 0);
    expect(modelCreator.getOrCreateModel).toHaveBeenCalledWith('model', 'DataSourceSchema');
    expect(data).toEqual({
      data: { hour: [1, 2, 3] },
    });
  });
  it('should fetch data from file server for given json file', async () => {
    fs.existsSync.mockReturnValueOnce(true);
    fs.readFileSync.mockReturnValueOnce(JSON.stringify([{ hour: 1 }, { hour: 2 }, { hour: 3 }]));
    dataSourceMetadataRepository.getDatasourceMetadataForDatasourceId.mockResolvedValueOnce({
      fileType: 'json',
      fileId: 'multerFileId',
    });
    const dataSourceID = 'model';
    const data = await datasourceService.getData(dataSourceID);
    expect(data).toEqual({ data: [{ hour: 1 }, { hour: 2 }, { hour: 3 }] });
  });
  it('should fetch data from file server for given geojson', async () => {
    fs.existsSync.mockReturnValueOnce(true);
    fs.readFileSync.mockReturnValueOnce(
      JSON.stringify({
        type: 'featureCollection',
        features: [
          { properties: { id: 1, name: 'MH' } },
          { properties: { id: 2, name: 'KA' } },
          { properties: { id: 1, name: 'TN' } },
        ],
      }),
    );

    dataSourceMetadataRepository.getDatasourceMetadataForDatasourceId.mockResolvedValueOnce({
      fileType: 'geojson',
      fileId: 'multerFileId',
    });

    const dataSourceID = 'model';
    const data = await datasourceService.getData(dataSourceID);
    expect(data).toEqual({
      data: {
        type: 'featureCollection',
        features: [
          { properties: { id: 1, name: 'MH' } },
          { properties: { id: 2, name: 'KA' } },
          { properties: { id: 1, name: 'TN' } },
        ],
      },
    });
  });

  it('should fetch data from file server for given geojson file with filters', async () => {
    fs.existsSync.mockReturnValueOnce(true);
    fs.readFileSync.mockReturnValueOnce(
      JSON.stringify({
        type: 'featureCollection',
        features: [
          { properties: { id: 1, name: 'MH' } },
          { properties: { id: 2, name: 'KA' } },
          { properties: { id: 1, name: 'TN' } },
        ],
      }),
    );

    dataSourceMetadataRepository.getDatasourceMetadataForDatasourceId.mockResolvedValueOnce({
      fileType: 'geojson',
      fileId: 'multerFileId',
    });

    const dataSourceID = 'model';
    const data = await datasourceService.getData(dataSourceID, undefined, {
      filter: {
        propertyKey: 'name',
        value: 'MH',
      },
    });

    expect(data).toEqual({
      data: {
        type: 'featureCollection',
        features: [{ properties: { id: 1, name: 'MH' } }],
      },
    });
  });

  it('should throw exception for datasource not found if file is not present', async () => {
    fs.existsSync.mockReturnValueOnce(false);
    dataSourceMetadataRepository.getDatasourceMetadataForDatasourceId.mockResolvedValueOnce({
      fileType: 'json',
      fileId: 'multerFileId',
    });
    const result = async () => {
      await datasourceService.getData('dataSourceID');
    };
    await expect(result).rejects.toThrow(new DatasourceNotFoundException('multerFileId'));
  });
  it('should throw exception for datasource not found if geojson file is present', async () => {
    fs.existsSync.mockReturnValueOnce(false);
    dataSourceMetadataRepository.getDatasourceMetadataForDatasourceId.mockResolvedValueOnce({
      fileType: 'geojson',
      fileId: 'multerFileId',
    });
    const result = async () => {
      await datasourceService.getData('dataSourceID');
    };
    await expect(result).rejects.toThrow(new DatasourceNotFoundException('multerFileId'));
  });
  it('should throw exception for datasource not found file is not supported format', async () => {
    dataSourceMetadataRepository.getDatasourceMetadataForDatasourceId.mockResolvedValueOnce({
      fileId: 'multerFileId',
    });
    const result = async () => {
      await datasourceService.getData('dataSourceID');
    };
    await expect(result).rejects.toThrow(new DatasourceNotFoundException('multerFileId'));
  });

  it('should throw exception for datasource not found if metadata is not present', async () => {
    dataSourceMetadataRepository.getDatasourceMetadataForDatasourceId.mockResolvedValueOnce(null);
    const result = async () => {
      await datasourceService.getData('dataSourceID');
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
    modelCreator.getOrCreateModel.mockReturnValue('DataSourceModel');
    dataSourceRepository.getData.mockResolvedValue([
      { hour: 1, susceptible: 99, exposed: 90 },
      { hour: 2, susceptible: 98, exposed: 90 },
      { hour: 3, susceptible: 97, exposed: 90 },
    ]);
    const dataSourceId = 'model';

    const result = async () => {
      await datasourceService.getData(dataSourceId, ['hours', 'exposed']);
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

    const data = await datasourceService.bulkDeleteDatasource(['datasource1', 'datasource2']);
    expect(dataSourceRepository.bulkDeleteCsv).toHaveBeenCalledWith(['datasource1', 'datasource2']);
    expect(dataSourceMetadataRepository.bulkDeleteDatasourceMetadata).toHaveBeenCalledWith([
      'datasource1',
      'datasource2',
    ]);

    expect(data).toEqual({ deletedCount: 2 });
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
      modelCreator.getOrCreateModel.mockReturnValue('DataSourceModel');
      const dataSourceId = 'model';
      await datasourceService.getData(dataSourceId, ['hour']);
    });

    it('should getDataSourceSchema to have been called with dataSource name', function () {
      expect(dataSourceMetadataRepository.getDataSourceSchemaById).toHaveBeenCalledWith('model');
    });

    it('should dataSourceRepository.getData to have been called with created model', function () {
      expect(dataSourceRepository.getData).toHaveBeenCalledWith('DataSourceModel', { hour: 1 }, 0);
    });

    it('should createModel to have been called with dataSource name and schema', function () {
      expect(modelCreator.getOrCreateModel).toHaveBeenCalledWith('model', 'DataSourceSchema');
    });
  });

  describe('should delete all json and extended datasources for given dashboard id', () => {
    beforeEach(async () => {
      fs.existsSync.mockReturnValue(true);
      fs.rmSync.mockReturnValue(true);
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
      await datasourceService.bulkDeleteDatasource(['dashboardId']);
      expect(fs.rmSync).toHaveBeenCalledTimes(2);
      expect(fs.rmSync).toHaveBeenCalledWith('./uploads/multerId');
      expect(dataSourceMetadataRepository.bulkDeleteDatasourceMetadata).toHaveBeenCalledWith([
        'dashboardId',
      ]);
    });

    it('should should return deleted count', async () => {
      const result = await datasourceService.bulkDeleteDatasource(['dashboardId']);
      expect(result).toEqual({ deletedCount: 1 });
    });

    it('should delete csv datasource along with metadata', async () => {
      dataSourceMetadataRepository.getDatasourceMetadataForDatasourceId.mockResolvedValue({
        _id: 'datasource1',
        fileType: 'csv',
      });
      await datasourceService.deleteDatasource('datasource1');

      expect(dataSourceRepository.deleteDatasource).toHaveBeenCalledWith('datasource1');
      expect(fs.rmSync).not.toHaveBeenCalled();
      expect(
        dashboardDatasourceMapRepository.deleteDataSourceDashboardMapping,
      ).toHaveBeenCalledWith('datasource1');
      expect(dataSourceMetadataRepository.deleteDatasourceMetadata).toHaveBeenCalledWith(
        'datasource1',
      );
    });

    it('should delete geojson datasource along with metadata', async () => {
      dataSourceMetadataRepository.getDatasourceMetadataForDatasourceId.mockResolvedValue({
        _id: 'datasource1',
        fileType: 'geojson',
        fileId: 'datasource1',
      });
      await datasourceService.deleteDatasource('datasource1');

      expect(fs.rmSync).toHaveBeenCalledWith('./uploads/datasource1');
      expect(dataSourceRepository.deleteDatasource).not.toHaveBeenCalled();
      expect(
        dashboardDatasourceMapRepository.deleteDataSourceDashboardMapping,
      ).toHaveBeenCalledWith('datasource1');
      expect(dataSourceMetadataRepository.deleteDatasourceMetadata).toHaveBeenCalledWith(
        'datasource1',
      );
    });

    it('should delete json datasource along with metadata', async () => {
      dataSourceMetadataRepository.getDatasourceMetadataForDatasourceId.mockResolvedValue({
        _id: 'datasource1',
        fileType: 'json',
        fileId: 'datasource1',
      });
      await datasourceService.deleteDatasource('datasource1');

      expect(dataSourceRepository.deleteDatasource).not.toHaveBeenCalled();
      expect(fs.rmSync).toHaveBeenCalledWith('./uploads/datasource1');
      expect(
        dashboardDatasourceMapRepository.deleteDataSourceDashboardMapping,
      ).toHaveBeenCalledWith('datasource1');
      expect(dataSourceMetadataRepository.deleteDatasourceMetadata).toHaveBeenCalledWith(
        'datasource1',
      );
    });

    it('should delete mapping and metadata if filetype is not csv, json or geojson', async () => {
      dataSourceMetadataRepository.getDatasourceMetadataForDatasourceId.mockResolvedValue({
        _id: 'datasource1',
        fileType: 'text',
        fileId: 'datasource1',
      });
      await datasourceService.deleteDatasource('datasource1');

      expect(dataSourceRepository.deleteDatasource).not.toHaveBeenCalled();
      expect(fs.rmSync).not.toHaveBeenCalledWith();
      expect(
        dashboardDatasourceMapRepository.deleteDataSourceDashboardMapping,
      ).toHaveBeenCalledWith('datasource1');
      expect(dataSourceMetadataRepository.deleteDatasourceMetadata).toHaveBeenCalledWith(
        'datasource1',
      );
    });

    it('should return an error if datasource is not present', async () => {
      dataSourceMetadataRepository.getDatasourceMetadataForDatasourceId.mockResolvedValue(null);

      const result = async () => {
        await datasourceService.deleteDatasource('datasource1');
      };

      await expect(result).rejects.toThrow(new DatasourceNotFoundException('datasource1'));
      expect(dataSourceRepository.deleteDatasource).not.toHaveBeenCalled();
      expect(
        dashboardDatasourceMapRepository.deleteDataSourceDashboardMapping,
      ).not.toHaveBeenCalled();
      expect(dataSourceMetadataRepository.deleteDatasourceMetadata).not.toHaveBeenCalled();
    });
  });
  describe('update datasources with given id', () => {
    it('should add new column with given name and expression', async () => {
      dataSourceMetadataRepository.updateDatasourceSchema.mockResolvedValue({ n: 1 });
      dataSourceMetadataRepository.updateOrInsertCustomColumn.mockResolvedValue({
        n: 10,
        nModified: 0,
      });
      dataSourceMetadataRepository.getDataSourceSchemaById.mockResolvedValue({
        dataSourceSchema: {
          column1: 'Number',
          col2: 'String',
        },
      });
      dataSourceRepository.addColumn.mockResolvedValueOnce({ n: 10, nModified: 0 });
      modelCreator.getOrCreateModel.mockReturnValue('DataSourceModel');

      const result = await datasourceService.updateDatasource('datasource1', {
        columnName: 'newColumn',
        expression: '"column1" + 1',
      });

      expect(result).toEqual({
        datasource: { n: 10, nModified: 0 },
        metadata: { n: 10, nModified: 0 },
      });

      expect(modelCreator.getOrCreateModel).toHaveBeenCalledWith('datasource1', {
        column1: 'Number',
        col2: 'String',
        newColumn: 'Number',
      });

      expect(dataSourceMetadataRepository.updateDatasourceSchema).toHaveBeenCalledWith(
        'datasource1',
        {
          column1: 'Number',
          col2: 'String',
          newColumn: 'Number',
        },
      );
      expect(dataSourceRepository.addColumn).toHaveBeenCalledWith(
        'DataSourceModel',
        {
          $add: ['$column1', 1],
        },
        'newColumn',
      );
      expect(dataSourceMetadataRepository.updateOrInsertCustomColumn).toHaveBeenCalledWith(
        'datasource1',
        {
          name: 'newColumn',
          expression: '"column1" + 1',
        },
      );
    });

    it('should delete custom column from datasource', async () => {
      dataSourceMetadataRepository.getDataSourceSchemaById.mockResolvedValue({
        dataSourceSchema: {
          column1: 'number',
          col2: 'String',
          columnName: 'Number',
        },
      });
      modelCreator.getOrCreateModel.mockReturnValue('DataSourceModel');
      dataSourceRepository.deleteColumn.mockResolvedValueOnce({ n: 1, nModified: 0 });
      dataSourceMetadataRepository.updateDatasourceSchema.mockResolvedValue({ n: 1 });
      dataSourceMetadataRepository.deleteCustomColumn.mockResolvedValue({
        n: 1,
        nModified: 1,
      });

      await datasourceService.deleteDatasourceColumn('datasource1', 'columnName');

      expect(dataSourceMetadataRepository.getDataSourceSchemaById).toHaveBeenCalledWith(
        'datasource1',
      );
      expect(modelCreator.getOrCreateModel).toHaveBeenCalledWith('datasource1', {
        col2: 'String',
        column1: 'number',
      });
      expect(dataSourceRepository.deleteColumn).toHaveBeenCalledWith(
        'DataSourceModel',
        'columnName',
      );
      expect(
        dataSourceMetadataRepository.updateDatasourceSchema,
      ).toHaveBeenCalledWith('datasource1', { col2: 'String', column1: 'number' });
      expect(dataSourceMetadataRepository.deleteCustomColumn).toHaveBeenCalledWith(
        'datasource1',
        'columnName',
      );
    });

    it('should throw error if column name is wrong', async () => {
      dataSourceMetadataRepository.updateDatasourceSchema.mockResolvedValue({ n: 1 });
      dataSourceMetadataRepository.updateOrInsertCustomColumn.mockResolvedValue({
        n: 10,
        nModified: 0,
      });
      dataSourceMetadataRepository.getDataSourceSchemaById.mockResolvedValue({
        dataSourceSchema: {
          column1: 'number',
          col2: 'String',
        },
      });
      dataSourceRepository.addColumn.mockResolvedValueOnce({ n: 10, nModified: 0 });
      modelCreator.getOrCreateModel.mockReturnValue('DataSourceModel');

      const result = async () => {
        await datasourceService.updateDatasource('datasource1', {
          columnName: 'newColumn%',
          expression: '"column1" "column1"',
        });
      };

      await expect(result).rejects.toThrow(
        new InvalidInputException('Invalid column name-Column name can include alphabets, numbers, -, _ or space', 1016),
      );
    });

    it('should throw error if expression is wrong', async () => {
      dataSourceMetadataRepository.updateDatasourceSchema.mockResolvedValue({ n: 1 });
      dataSourceMetadataRepository.updateOrInsertCustomColumn.mockResolvedValue({
        n: 10,
        nModified: 0,
      });
      dataSourceMetadataRepository.getDataSourceSchemaById.mockResolvedValue({
        dataSourceSchema: {
          column1: 'number',
          col2: 'String',
        },
      });
      dataSourceRepository.addColumn.mockResolvedValueOnce({ n: 10, nModified: 0 });
      modelCreator.getOrCreateModel.mockReturnValue('DataSourceModel');

      const result = async () => {
        await datasourceService.updateDatasource('datasource1', {
          columnName: 'newColumn',
          expression: '"column1" "column1"',
        });
      };

      await expect(result).rejects.toThrow(
        new InvalidInputException('Given expression for column is invalid', 1015),
      );
    });
  });
});
