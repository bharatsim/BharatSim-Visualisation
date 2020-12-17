const mongoService = require('../services/mongoService');

async function getData(datasourceModel, columnsMap) {
  return datasourceModel.find({}, { _id: 0, ...columnsMap }).then((data) => data);
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
};
