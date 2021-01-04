const { MongoClient } = require('mongodb')

let mongoDbConnection;

async function connect(url) {
  const client = new MongoClient(url, { useUnifiedTopology: true })
  mongoDbConnection = await client.connect();
  return mongoDbConnection;
}

function getConnection(){
  return mongoDbConnection;
}


module.exports = {
  connect,
  getConnection,
};
