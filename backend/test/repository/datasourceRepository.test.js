const mongoose = require('mongoose');
const DataSourceRepository = require('../../src/repository/datasourceRepository');
const dbHandler = require('../db-handler');

const { Schema } = mongoose;

const schema = {
  hour: 'number',
  susceptible: 'number',
  recovered: 'number',
};

const model = new Schema(schema);
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
const datasourceDataForAggregation = [
  {
    hour: 1,
    susceptible: 5,
    recovered: 3,
  },
  {
    hour: 2,
    susceptible: 2,
    recovered: 2,
  },
  {
    hour: 3,
    susceptible: 3,
    recovered: 10,
  },
  {
    hour: 1,
    susceptible: 2,
    recovered: 12,
  },
  {
    hour: 2,
    susceptible: 3,
    recovered: 10,
  },
  {
    hour: 3,
    susceptible: 4,
    recovered: 20,
  },
];

const DataSourceModel = mongoose.model('dataSourceModel', model);

const parseMongoDBResult = (result) => JSON.parse(JSON.stringify(result));

describe('get Datasource name ', () => {
  let connection;
  beforeAll(async () => {
    await dbHandler.connect();
    connection = await dbHandler.connectUsingMongo();
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
  it('should return aggregated data based on aggregations params and given datasource model', async () => {
    await DataSourceModel.insertMany(datasourceDataForAggregation);
    const data = parseMongoDBResult(
      await DataSourceRepository.getAggregatedData(
        DataSourceModel,
        {
          groupBy: ['hour'],
          aggregate: {
            recovered: 'avg',
            susceptible: 'sum',
          },
        },
        0,
      ),
    );
    data.sort((v1, v2) => v1.hour - v2.hour);
    expect(data).toEqual([
      { recovered: 7.5, susceptible: 7, hour: 1 },
      { recovered: 6, susceptible: 5, hour: 2 },
      { recovered: 15, susceptible: 7, hour: 3 },
    ]);
  });
  it('should return aggregated and filtered  data based on aggregations params', async () => {
    await DataSourceModel.insertMany(datasourceDataForAggregation);
    const data = parseMongoDBResult(
      await DataSourceRepository.getAggregatedData(DataSourceModel, {
        groupBy: ['hour'],
        aggregate: {
          recovered: 'avg',
          susceptible: 'sum',
        },
        filter: { propertyKey: 'hour', value: 3 },
      }),
    );
    expect(data).toEqual([{ recovered: 15, susceptible: 7, hour: 3 }]);
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
    await DataSourceRepository.bulkInsert('metadataId1', datasourceData);
    await DataSourceRepository.bulkInsert('metadataId2', datasourceData);
    await DataSourceRepository.bulkInsert('metadataId3', datasourceData);

    const result = await DataSourceRepository.bulkDeleteCsv(['metadataId1', 'metadataId3']);
    expect(result.toString()).toBe('true,true');

    const db = connection.db();

    const collectionList = await db
      .listCollections()
      .toArray()
      .then((collections) => collections.map((collection) => collection.name));

    expect(collectionList).toEqual(['metadataId2']);
  });

  it('should delete dataSource for given id', async () => {
    await DataSourceRepository.bulkInsert('metadataId1', datasourceData);
    const result = await DataSourceRepository.deleteDatasource('metadataId1');

    expect(result).toEqual(true);

    const db = connection.db();

    const collectionList = await db
      .listCollections()
      .toArray()
      .then((collections) => collections.map((collection) => collection.name));

    expect(collectionList).toEqual([]);
  });

  it('should add column for given expression', async () => {
    const modelName = 'datasource1';
    const Datasource = mongoose.model(modelName, model);
    await Datasource.insertMany(datasourceDataForAggregation);

    delete mongoose.connection.models[modelName];
    mongoose.model(
      modelName,
      new Schema({ ...schema, column1: 'number' }, { collection: modelName, strict: false }),
    );

    await DataSourceRepository.addColumn(Datasource, { $sum: ['$recovered', '$hour'] }, 'column1');

    const data = parseMongoDBResult(await Datasource.find({}));
    const { hour: row1Hour, recovered: row1Recovered } = datasourceDataForAggregation[0];
    const { hour: row2Hour, recovered: row2Recovered } = datasourceDataForAggregation[1];
    expect(data[0].column1).toEqual(row1Hour + row1Recovered);
    expect(data[1].column1).toEqual(row2Hour + row2Recovered);
  });

  it('should delete column with given column name', async () => {
    const modelName = 'datasource3';
    const Datasource = mongoose.model(modelName, model);
    await Datasource.insertMany(datasourceDataForAggregation);

    await DataSourceRepository.deleteColumn(Datasource, 'hour');

    const data = parseMongoDBResult(await Datasource.find({}));

    expect(data[0].hour).toEqual(undefined);
    expect(data[1].hour).toEqual(undefined);
  });
});
