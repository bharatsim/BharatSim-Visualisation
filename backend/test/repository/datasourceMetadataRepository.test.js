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
    customColumns: [],
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
    customColumns: [],
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

  describe('getDataSourceNames', () => {
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

  describe('get DataSource metadata by dashboard id', () => {
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
        customColumns: [],
      }));

      const insertedIds = insertedMetadata.map((metadata) => metadata.id.toString());

      const dataSources = parseMongoDBResult(
        await DataSourceMetaDataRepository.getDataSourcesMetadataByIds(insertedIds),
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
      customColumns: [],
    }))[0];

    const insertedIds = insertedMetadata.map((metadata) => metadata.id.toString());

    const dataSources = parseMongoDBResult(
      await DataSourceMetaDataRepository.getAllExceptDatasourceIds([insertedIds[1]]),
    );

    expect(dataSources).toEqual([expectedResult]);
  });

  describe('get DataSource Schema By Id', () => {
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

  describe('get all datasources', () => {
    it('should return all datasources', async () => {
      await DataSourceMetaData.insertMany(dataSourceMetadata);
      const schema = parseMongoDBResult(
        await DataSourceMetaDataRepository.getDatasourcesMetadata(
          {},
          { __v: 0, _id: 0, createdAt: 0, updatedAt: 0 },
        ),
      );

      expect(schema).toEqual(dataSourceMetadata);
    });
    it('should return all datasources with all column', async () => {
      await DataSourceMetaData.insertMany(dataSourceMetadata);
      const schema = parseMongoDBResult(
        await DataSourceMetaDataRepository.getDatasourcesMetadata(),
      );

      expect(schema.length).toEqual(dataSourceMetadata.length);
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
      customColumns: [],
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
      customColumns: [],
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

  describe('should update datasource schema', () => {
    it('should add new column to the previously defined schema for given datasource id', async () => {
      const insertedMetadata = await DataSourceMetaData.insertMany(dataSourceMetadata);
      const { _id: firstMetadataId } = insertedMetadata[0];
      await DataSourceMetaDataRepository.updateDatasourceSchema(firstMetadataId, {
        hour: 'number',
        susceptible: 'number',
        newColumn: 'number',
      });
      const firstDatasourceMetadata = await DataSourceMetaDataRepository.getDataSourceSchemaById(
        firstMetadataId,
      );

      expect(firstDatasourceMetadata.dataSourceSchema).toEqual({
        hour: 'number',
        susceptible: 'number',
        newColumn: 'number',
      });
    });
  });
  describe('custom column CRUD', () => {
    it('should add new custom column', async () => {
      const insertedMetadata = await DataSourceMetaData.insertMany(dataSourceMetadata);
      const { _id: firstMetadataId } = insertedMetadata[0];
      await DataSourceMetaDataRepository.addCustomColumn(firstMetadataId, {
        name: 'column1',
        expression: '1 + 2',
      });
      const firstDatasourceMetadata = parseMongoDBResult(
        await DataSourceMetaDataRepository.getDatasourcesMetadata(
          { _id: firstMetadataId },
          { 'customColumns._id': 0 },
        ),
      )[0];

      expect(firstDatasourceMetadata.customColumns).toEqual([
        {
          name: 'column1',
          expression: '1 + 2',
        },
      ]);
    });

    it('should update custom column', async () => {
      const insertedMetadata = await DataSourceMetaData.insertMany(dataSourceMetadata);
      const { _id: firstMetadataId } = insertedMetadata[0];
      await DataSourceMetaDataRepository.addCustomColumn(firstMetadataId, {
        name: 'column1',
        expression: '1 + 2',
      });
      await DataSourceMetaDataRepository.updateOrInsertCustomColumn(firstMetadataId, {
        name: 'column1',
        expression: '1 + 5',
      });

      const firstDatasourceMetadata = parseMongoDBResult(
        await DataSourceMetaDataRepository.getDatasourcesMetadata(
          { _id: firstMetadataId },
          { 'customColumns._id': 0 },
        ),
      )[0];

      expect(firstDatasourceMetadata.customColumns).toEqual([
        {
          name: 'column1',
          expression: '1 + 5',
        },
      ]);
    });

    it('should add new custom column if column name is not found', async () => {
      const insertedMetadata = await DataSourceMetaData.insertMany(dataSourceMetadata);
      const { _id: firstMetadataId } = insertedMetadata[0];
      await DataSourceMetaDataRepository.addCustomColumn(firstMetadataId, {
        name: 'column1',
        expression: '1 + 2',
      });
      await DataSourceMetaDataRepository.updateOrInsertCustomColumn(firstMetadataId, {
        name: 'column2',
        expression: '1 + 5',
      });

      const firstDatasourceMetadata = parseMongoDBResult(
        await DataSourceMetaDataRepository.getDatasourcesMetadata(
          { _id: firstMetadataId },
          { 'customColumns._id': 0 },
        ),
      )[0];

      expect(firstDatasourceMetadata.customColumns).toEqual([
        {
          name: 'column1',
          expression: '1 + 2',
        },
        {
          name: 'column2',
          expression: '1 + 5',
        },
      ]);
    });

    it('should delete custom column', async () => {
      const insertedMetadata = await DataSourceMetaData.insertMany(dataSourceMetadata);
      const { _id: firstMetadataId } = insertedMetadata[0];
      await DataSourceMetaDataRepository.addCustomColumn(firstMetadataId, {
        name: 'column1',
        expression: '1 + 2',
      });
      await DataSourceMetaDataRepository.deleteCustomColumn(firstMetadataId, 'column1');

      const firstDatasourceMetadata = parseMongoDBResult(
        await DataSourceMetaDataRepository.getDatasourcesMetadata(
          { _id: firstMetadataId },
          { 'customColumns._id': 0 },
        ),
      )[0];

      expect(firstDatasourceMetadata.customColumns).toEqual([]);
    });
  });
});
