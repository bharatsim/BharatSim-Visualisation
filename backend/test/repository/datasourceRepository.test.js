const mongoose = require('mongoose');
const DataSourceRepository = require('../../src/repository/datasourceRepository');
const dbHandler = require('../db-handler');

const { Schema } = mongoose;

const model = new Schema({
  hour: 'number',
  susceptible: 'number',
});
const datasourceData = [
  {
    hour: 1,
    susceptible: 99,
  },
  {
    hour: 2,
    susceptible: 98,
  },
  {
    hour: 3,
    susceptible: 97,
  },
];

const DataSourceModel = mongoose.model('dataSourceModel', model);

const parseMongoDBResult = (result) => JSON.parse(JSON.stringify(result));

describe('get Datasource name ', () => {
  beforeAll(async () => {
    await dbHandler.connect();
    await dbHandler.connectUsingMongo();
  });
  afterEach(async () => {
    await dbHandler.clearDatabase();
  });
  afterAll(async () => {
    await dbHandler.closeDatabase();
  });
  it('should return all data for given datasource model', async () => {
    await DataSourceModel.insertMany(datasourceData);

    const data = parseMongoDBResult(
      await DataSourceRepository.getData(DataSourceModel, { __v: 0 }),
    );

    expect(data).toEqual([
      { hour: 1, susceptible: 99 },
      { hour: 2, susceptible: 98 },
      { hour: 3, susceptible: 97 },
    ]);
  });

  it('should return all data for given datasource model and selected fields', async () => {
    await DataSourceModel.insertMany(datasourceData);

    const data = parseMongoDBResult(
      await DataSourceRepository.getData(DataSourceModel, { hour: 1 }),
    );

    expect(data).toEqual([{ hour: 1 }, { hour: 2 }, { hour: 3 }]);
  });

  it('should return empty array if document not present', async () => {
    const data = parseMongoDBResult(await DataSourceRepository.getData(DataSourceModel));

    expect(data).toEqual([]);
  });

  it('should insert data for given model', async () => {
    const data = parseMongoDBResult(
      await DataSourceRepository.insert(DataSourceModel, datasourceData),
    );
    expect(data.length).toEqual(datasourceData.length);
  });

  it('should insert data at bulk for given model', async () => {
    const data = parseMongoDBResult(
      await DataSourceRepository.bulkInsert('metadataId', datasourceData),
    );

    expect(data.result.n).toEqual(datasourceData.length);
  });

  it('should delete at bulk for given ids', async () => {
    const connection = await dbHandler.connectUsingMongo();

    await DataSourceRepository.bulkInsert('metadataId1', datasourceData);
    await DataSourceRepository.bulkInsert('metadataId2', datasourceData);
    await DataSourceRepository.bulkInsert('metadataId3', datasourceData);

    const result = await DataSourceRepository.bulkDeleteCsv(['metadataId1', 'metadataId3']);
    expect(result.toString()).toBe('true,true');

    const collectionList = await connection
      .db()
      .listCollections()
      .toArray()
      .then((collections) => collections.map((collection) => collection.name));

    expect(collectionList).toEqual(['metadataId2']);
  });
});
