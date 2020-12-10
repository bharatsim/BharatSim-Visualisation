const dashboardDatasourceMapRepository = require('../../src/repository/dashboardDatasourceMapRepository');
const DatasourceDashboardMap = require('../../src/model/datasourceDashboardMap');
const dbHandler = require('../db-handler');

const parseMongoDBResult = (result) => JSON.parse(JSON.stringify(result));

describe('dashboardDatasourceMapRepository', () => {
  beforeAll(async () => {
    await dbHandler.connect();
  });
  afterEach(async () => {
    await dbHandler.clearDatabase();
  });
  afterAll(async () => {
    await dbHandler.closeDatabase();
  });
  describe('insertDatasourceDashboardMap',  () => {
    it('insert datasource and dashboard id map in collection', async () => {
      const dashboardId = '5fd084fe0fbe24c086935aca';
      const datasourceId = '5fd084fe0fbe24c086935acb';
      await dashboardDatasourceMapRepository.insertDatasourceDashboardMap(
        datasourceId,
        dashboardId,
      );

      const foundData = parseMongoDBResult(
        await DatasourceDashboardMap.find({ datasourceId }, { __v: 0, _id: 0 }),
      );

      expect(foundData).toEqual([{ datasourceId, dashboardId }]);
    });
  });
  describe('getDatasourceIds', () => {
    it('should get datasourceIds for provided dashboard', async () => {
      await DatasourceDashboardMap.insertMany([
        { datasourceId: '5fd084fe0fbe24c086935acb', dashboardId: '5fd084fe0fbe24c086935aca' },
        { datasourceId: '5fd084fe0fbe24c086935acc', dashboardId: '5fd084fe0fbe24c086935aca' },
        { datasourceId: '5fd084fe0fbe24c086935acd', dashboardId: '5fd084fe0fbe24c086935aca' },
      ]);

      const result = parseMongoDBResult(
        await dashboardDatasourceMapRepository.getDatasourceIdsForDashboard('5fd084fe0fbe24c086935aca'),
      );

      expect(result).toEqual([
        '5fd084fe0fbe24c086935acb',
        '5fd084fe0fbe24c086935acc',
        '5fd084fe0fbe24c086935acd',
      ]);
    });
  });

  describe('deleteDatasourceMapping', () => {
    it('should get datasourceIds for provided dashboard', async () => {
      await DatasourceDashboardMap.insertMany([
        { datasourceId: '5fd084fe0fbe24c086935acb', dashboardId: '5fd084fe0fbe24c086935aca' },
        { datasourceId: '5fd084fe0fbe24c086935acc', dashboardId: '5fd084fe0fbe24c086935aca' },
        { datasourceId: '5fd084fe0fbe24c086935acd', dashboardId: '5fd084fe0fbe24c086935acf' },
      ]);

      await dashboardDatasourceMapRepository.deleteDatasourceMapping('5fd084fe0fbe24c086935aca');


      const foundData = parseMongoDBResult(
        await DatasourceDashboardMap.find({ datasourceId:'5fd084fe0fbe24c086935aca' }, { __v: 0, _id: 0 }),
      );

      expect(foundData).toEqual([]);
    });
  });
});
