const mongoose = require('mongoose');

const DataSourceMetaData = require('../../src/model/datasourceMetadata');
const DataSourceMetaDataRepository = require('../../src/repository/datasourceMetadataRepository');
const DataSourceNotFoundException = require('../../src/exceptions/DatasourceNotFoundException');
const dbHandler = require('../db-handler');

const dataSourceMetadata = [
  {
    name: 'model_1',
    dataSourceSchema: {
      hour: 'number',
      susceptible: 'number',
    },
    fileSize: 123,
    fileType: 'csv',
    fileId: 'fileidByMulter',
  },
  {
    name: 'model_2',
    dataSourceSchema: {
      hour_: 'number',
      susceptible_: 'number',
    },
    fileSize: 123,
    fileType: 'csv',
    fileId: 'fileidByMulter',
  },
];

const parseMongoDBResult = (result) => JSON.parse(JSON.stringify(result));

describe('Datasource metadata repository', () => {
  beforeAll(async () => {
    await dbHandler.connect();
  });
  afterEach(async () => {
    await dbHandler.clearDatabase();
  });
  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  describe('getDataSourceNames', function () {
    it('should return names of all present data sources', async () => {
      const insertedMetadata = await DataSourceMetaData.insertMany(dataSourceMetadata);
      const expectedResult = insertedMetadata.map((metadata) => ({
        _id: metadata.id,
        name: metadata.name,
      }));

      const names = parseMongoDBResult(await DataSourceMetaDataRepository.getDataSourceNames());

      expect(names).toEqual(expectedResult);
    });
  });

  describe('get DataSource metadata by dashboard id', function () {
    it('should return DataSource metadata for given datasource id', async () => {
      const insertedMetadata = await DataSourceMetaData.insertMany(dataSourceMetadata);

      const expectedResult = insertedMetadata.map((metadata) => ({
        _id: metadata.id,
        name: metadata.name,
        fileSize: metadata.fileSize,
        fileType: metadata.fileType,
        createdAt: metadata.createdAt.toISOString(),
        updatedAt: metadata.updatedAt.toISOString(),
        fileId: 'fileidByMulter',
      }));

      const insertedIds = insertedMetadata.map((metadata) => metadata.id.toString());

      const dataSources = parseMongoDBResult(
        await DataSourceMetaDataRepository.getManyDataSourcesMetadataByIds(insertedIds),
      );

      expect(dataSources).toEqual(expectedResult);
    });
  });
  it('should get All Except given Datasource Ids', async () => {
    const insertedMetadata = await DataSourceMetaData.insertMany(dataSourceMetadata);

    const expectedResult = insertedMetadata.map((metadata) => ({
      _id: metadata.id,
      name: metadata.name,
      fileSize: metadata.fileSize,
      fileType: metadata.fileType,
      createdAt: metadata.createdAt.toISOString(),
      updatedAt: metadata.updatedAt.toISOString(),
      fileId: 'fileidByMulter',
    }))[0];

    const insertedIds = insertedMetadata.map((metadata) => metadata.id.toString());

    const dataSources = parseMongoDBResult(
      await DataSourceMetaDataRepository.getAllExceptDatasourceIds([insertedIds[1]]),
    );

    expect(dataSources).toEqual([expectedResult]);
  });

  describe('get DataSource Schema By Id', function () {
    it('should return datasource schema for given datasource name for csv', async () => {
      const insertedMetadata = await DataSourceMetaData.insertMany(dataSourceMetadata);
      const { _id: dataSourceId } = insertedMetadata[0];
      const schema = parseMongoDBResult(
        await DataSourceMetaDataRepository.getDataSourceSchemaById(dataSourceId),
      );

      expect(schema).toEqual({
        dataSourceSchema: {
          hour: 'number',
          susceptible: 'number',
        },
        fileType: 'csv',
      });
    });

    it('should throw exception if datasource is not available', async () => {
      await DataSourceMetaData.insertMany(dataSourceMetadata);
      const dataSourceId = new mongoose.Types.ObjectId('123112123112');

      await expect(
        DataSourceMetaDataRepository.getDataSourceSchemaById(dataSourceId),
      ).rejects.toBeInstanceOf(DataSourceNotFoundException);
      await expect(
        DataSourceMetaDataRepository.getDataSourceSchemaById(dataSourceId),
      ).rejects.toEqual(new DataSourceNotFoundException(dataSourceId));
    });
  });

  it('should insert a data for dataSource Metadata', async () => {
    await DataSourceMetaDataRepository.insert({
      name: 'model_1',
      dataSourceSchema: {
        hour: 'number',
        susceptible: 'number',
      },
      fileSize: 123,
      fileType: 'csv',
      fileId: 'fileIdByMulter',
    });

    const result = parseMongoDBResult(
      await DataSourceMetaData.findOne({ name: 'model_1' }, { _id: 0, __v: 0 }),
    );

    expect(result).toEqual({
      name: 'model_1',
      dataSourceSchema: {
        hour: 'number',
        susceptible: 'number',
      },
      fileSize: 123,
      fileType: 'csv',
      createdAt: expect.anything(),
      updatedAt: expect.anything(),
      fileId: 'fileIdByMulter',
    });
  });

  it('should delete a datasource metadata for given id', async () => {
    const { _id: collectionId } = await DataSourceMetaDataRepository.insert({
      name: dataSourceMetadata[0].name,
      dataSourceSchema: dataSourceMetadata[0].dataSourceSchema,
      fileSize: 123,
      fileType: 'csv',
      fileId: 'fileIdByMulter',
    });

    await DataSourceMetaDataRepository.deleteDatasourceMetadata(collectionId);

    const result = parseMongoDBResult(
      await DataSourceMetaData.find({ name: 'model_1' }, { _id: 0, __v: 0 }),
    );

    expect(result).toEqual([]);
  });
  it('should bulk delete a datasource metadata for given datasource ids', async () => {
    const { _id: collectionId1 } = await DataSourceMetaDataRepository.insert({
      name: 'model1',
      dataSourceSchema: dataSourceMetadata[0].dataSourceSchema,
      fileSize: 123,
      fileType: 'csv',
      fileId: 'fileIdByMulter',
    });
    const { _id: collectionId2 } = await DataSourceMetaDataRepository.insert({
      name: 'model2',
      dataSourceSchema: dataSourceMetadata[0].dataSourceSchema,
      fileSize: 123,
      fileType: 'csv',
      fileId: 'fileIdByMulter',
    });

    await DataSourceMetaDataRepository.bulkDeleteDatasourceMetadata([collectionId1, collectionId2]);

    const result = parseMongoDBResult(
      await DataSourceMetaData.find({ name: { $in: ['model_1', 'model_2'] } }, { _id: 0, __v: 0 }),
    );

    expect(result).toEqual([]);
  });
});
