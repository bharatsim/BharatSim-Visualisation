const mongoService = require('../services/mongoService');
const { transformAggregationParams } = require('../utils/dbUtils');

async function getData(datasourceModel, columnsMap) {
  return datasourceModel.find({}, { _id: 0, ...columnsMap });
}

async function getAggregatedData(datasourceModel, aggregationParams) {
  const {
    aggregateParam,
    groupByParam,
    projectAggregateParam,
    projectGroupByParam,
  } = transformAggregationParams(aggregationParams);
  return datasourceModel.aggregate([
    {
      $group: {
        _id: groupByParam,
        ...aggregateParam,
      },
    },
    {
      $project: { ...projectAggregateParam, ...projectGroupByParam, _id: 0 },
    },
  ]);
}

async function insert(datasourceModel, data) {
  return datasourceModel.insertMany(data);
}

async function bulkInsert(metadataId, data) {
  const connection = mongoService.getConnection();
  const db = connection.db();
  return db.collection(metadataId.toString()).insertMany(data);
}

async function bulkDeleteDataSources(datasourceIds) {
  const connection = mongoService.getConnection();
  const db = await connection.db();

  return Promise.all(
    datasourceIds.map(async (datsourceId) => {
      return db.dropCollection(datsourceId);
    }),
  );
}

async function bulkDeleteCsv(datasourceIds) {
  return bulkDeleteDataSources(datasourceIds);
}

module.exports = {
  getData,
  insert,
  bulkInsert,
  bulkDeleteCsv,
  getAggregatedData,
};
