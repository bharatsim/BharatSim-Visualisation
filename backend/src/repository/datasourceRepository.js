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
  const result = await db.collection(metadataId.toString()).insertMany(data);
  return result;
}

module.exports = {
  getData,
  insert,
  bulkInsert,
};
