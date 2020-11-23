const {MongoClient} = require('mongodb');
const { DATABASE_URL } = require('../../config');

async function getData(datasourceModel, columnsMap) {
  return datasourceModel.find({}, { _id: 0, ...columnsMap }).then((data) => data);
}
async function insert(datasourceModel, data) {
  return datasourceModel.insertMany(data);
}

async function bulkInsert(metadataId, data) {
  const client = new MongoClient(DATABASE_URL);
  const connection = await client.connect();
  const db = connection.db();
  const result = await db.collection(metadataId.toString()).insertMany(data);
  await connection.close();
  return result;
}

module.exports = {
  getData,
  insert,
  bulkInsert,
};
