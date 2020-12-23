const express = require('express');
const request = require('supertest');
const multer = require('multer');
const mongoService = require('../../src/services/mongoService');

const dbHandler = require('../db-handler');
const DataSourceMetaData = require('../../src/model/datasourceMetadata');
const DatasourceDashboardMap = require('../../src/model/datasourceDashboardMap');

const {
  dataSourceMetadata,
  model1Data,
  createModel,
  createDatasourceDashboardMapping,
} = require('./data');

const datasourcesRoutes = require('../../src/controller/datasourcesController');
const { parseDBObject } = require('../../src/utils/dbUtils');

describe('Integration test', () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  dbHandler.createTestUploadFolder();
  app.use(multer({ dest: dbHandler.TEST_FILE_UPLOAD_PATH }).single('datafile'));
  app.use('/datasources', datasourcesRoutes);
  let insertedMetadata;
  let dataSourceId;

  beforeAll(async () => {
    await dbHandler.connect();
    insertedMetadata = await DataSourceMetaData.insertMany(dataSourceMetadata);
    const { _id } = insertedMetadata[0];
    dataSourceId = _id;
    await DatasourceDashboardMap.insertMany(createDatasourceDashboardMapping(dataSourceId));
    await createModel(dataSourceId.toString()).insertMany(model1Data);
  });
  beforeEach(() => {
    dbHandler.createTestUploadFolder();
  });
  afterAll(async () => {
    await dbHandler.clearDatabase();
    await dbHandler.closeDatabase();
    dbHandler.clearTestUpload();
  });
  describe('/datasources', () => {
    it('should get data sources filter by dashboard id', async () => {
      const expectedDataSource = insertedMetadata.map((metadata) => ({
        _id: metadata.id,
        name: metadata.name,
        fileSize: metadata.fileSize,
        fileType: metadata.fileType,
        createdAt: metadata.createdAt.toISOString(),
        updatedAt: metadata.updatedAt.toISOString(),
        fileId: 'fileIdByMulter',
      }));
      await request(app)
        .get('/datasources?dashboardId=313233343536373839303137')
        .expect(200)
        .expect({ dataSources: [expectedDataSource[0]] });
    });
  });

  describe('/datasources/:id/headers', () => {
    it('should get headers', async () => {
      await request(app)
        .get(`/datasources/${dataSourceId}/headers`)
        .expect(200)
        .expect({
          headers: [
            { name: 'hour', type: 'number' },
            { name: 'susceptible', type: 'number' },
          ],
        });
    });

    it('should throw error if datasource not found', async () => {
      await request(app).get(`/datasources/123456789012/headers`).expect(404).expect({
        errorMessage: 'datasource with id 123456789012 not found',
        errorCode: 1002,
      });
    });
  });

  describe('/datasources/:id/', () => {
    it('should get data for requested columns', async () => {
      await request(app)
        .get(`/datasources/${dataSourceId}`)
        .query({ columns: ['susceptible', 'hour'] })
        .expect(200)
        .expect({ data: { susceptible: [1, 2, 3, 4, 5], hour: [0, 1, 2, 3, 4] } });
    });

    it('should throw error if data source not found', async () => {
      await request(app)
        .get('/datasources/123456789012')
        .query({ columns: ['expose', 'hour'] })
        .expect(404)
        .expect({
          errorMessage: 'datasource with id 123456789012 not found',
          errorCode: 1002,
        });
    });

    it('should send error message for columns not found exception', async () => {
      await request(app)
        .get(`/datasources/${dataSourceId}`)
        .query({ columns: ['exposeed', 'hour'] })
        .expect(200)
        .expect({});
    });
  });

  describe('Post /datasources', function () {
    it('should upload csv file in database with 200 as http response', async function () {
      const testSchemaModal1 = {
        hour: 'Number',
        susceptible: 'Number',
        exposed: 'Number',
        infected: 'Number',
        hospitalized: 'Number',
        recovered: 'Number',
        deceased: 'Number',
        city: 'String',
      };

      await dbHandler.connectUsingMongo();

      const response = await request(app)
        .post('/datasources')
        .field('schema', JSON.stringify(testSchemaModal1))
        .field('dashboardId', '313233343536373839303137')
        .field('name', 'datafile')
        .attach('datafile', 'test/data/simulation.csv')
        .expect(200);

      const uploadedFileCollectionId = response.body.collectionId;
      const { _id, dataSourceSchema } = parseDBObject(
        await DataSourceMetaData.findOne({ _id: uploadedFileCollectionId }),
      );
      const datasourceDashboardMappingCount = await DatasourceDashboardMap.find(
        {},
        { _id: 0, __v: 0 },
      ).countDocuments();

      const connection = mongoService.getConnection();
      const db = connection.db();
      const numberOfDocuments = await db.collection(uploadedFileCollectionId).countDocuments();

      await mongoService.close();

      expect(numberOfDocuments).toEqual(19);
      expect(datasourceDashboardMappingCount).toEqual(3);
      expect(_id).toEqual(uploadedFileCollectionId);
      expect(dataSourceSchema).toEqual(testSchemaModal1);
    });
    it('should upload json file in database', async () => {
      const response = await request(app)
        .post('/datasources')
        .field('schema', '{}')
        .field('dashboardId', '313233343536373839303198')
        .field('name', 'datafile')
        .attach('datafile', 'test/data/simulation.json')
        .expect(200);

      const uploadedFileCollectionId = response.body.collectionId;
      const { _id } = parseDBObject(
        await DataSourceMetaData.findOne({ _id: uploadedFileCollectionId }),
      );
      const datasourceDashboardMappingCount = await DatasourceDashboardMap.find(
        { dashboardId: '313233343536373839303198' },
        { _id: 0, __v: 0 },
      ).countDocuments();
      expect(datasourceDashboardMappingCount).toEqual(1);
      expect(_id).toEqual(uploadedFileCollectionId);
    });

    it('should provide a error when invalid file is uploaded', async function () {
      const testSchemaModal1 = {
        hour: 'Number',
        susceptible: 'Number',
        exposed: 'Number',
        infected: 'Number',
        hospitalized: 'Number',
        recovered: 'Number',
        deceased: 'Number',
        city: 'String',
      };

      await dbHandler.connectUsingMongo();

      await request(app)
        .post('/datasources')
        .field('schema', JSON.stringify(testSchemaModal1))
        .field('dashboardId', '313233343536373839303137')
        .field('name', 'datafile')
        .attach('datafile', 'test/data/test.png')
        .expect(400)
        .expect({
          errorMessage: 'Invalid Input - File type does not match',
          errorCode: 1010,
        });

      await mongoService.close();
    });
    // it('should throw and error if column data and schema are not compatible', async function () {
    //   const testSchemaModal1 = {
    //     hour: 'Number',
    //     susceptible: 'Number',
    //     exposed: 'Number',
    //     infected: 'Number',
    //     hospitalized: 'Number',
    //     recovered: 'Number',
    //     deceased: 'Number',
    //     city: 'Number',
    //   };
    //
    //   await dbHandler.connectUsingMongo();
    //
    //   await request(app)
    //     .post('/datasources')
    //     .field('schema', JSON.stringify(testSchemaModal1))
    //     .field('dashboardId', '313233343536373839303137')
    //     .field('name', 'datafile')
    //     .attach('datafile', 'test/data/simulation.csv')
    //     .expect(400)
    //     .expect({
    //       errorMessage: 'Invalid Input - Error while uploading csv file with invalid csv data',
    //       errorCode: 1008,
    //     });
    //
    //   await mongoService.close();
    // });
  });

  describe('delete /datasources', () => {
    it('should delete all file mapped with dashboard id', async function () {
      await dbHandler.connectUsingMongo();
      const connection = mongoService.getConnection();
      insertedMetadata = await DataSourceMetaData.insertMany(dataSourceMetadata);
      const { _id: dataSourceId1 } = insertedMetadata[0];
      const { _id: dataSourceId2 } = insertedMetadata[1];
      await DatasourceDashboardMap.insertMany([
        {
          dashboardId: '313233343536373839303131',
          datasourceId: dataSourceId1,
        },
        {
          dashboardId: '313233343536373839303131',
          datasourceId: dataSourceId2,
        },
      ]);
      const db = connection.db();
      await db.collection(dataSourceId1.toString()).insertMany(model1Data);
      await db.collection(dataSourceId2.toString()).insertMany(model1Data);

      await request(app)
        .delete('/datasources')
        .query({ datasourceIds: [dataSourceId1.toString(), dataSourceId2.toString()] })
        .expect(200)
        .expect({ deletedCount: 2 });
      const foundMetadata = parseDBObject(
        await DataSourceMetaData.find({
          _id: { $in: [dataSourceId1, dataSourceId2] },
        }),
      );
      expect(foundMetadata).toEqual([]);
      const isMappedDatasourceCollectionPresent = await db
        .listCollections()
        .toArray()
        .then((collections) =>
          collections.some((collection) =>
            [dataSourceId1.toString(), dataSourceId2.toString()].includes(collection.name),
          ),
        );
      expect(isMappedDatasourceCollectionPresent).toEqual(false);
    });
  });
});
