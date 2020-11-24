const { MongoClient } = require('mongodb')

let mongoDbConnection;

async function connect(url) {
  let client = new MongoClient(url, { useUnifiedTopology: true })
  mongoDbConnection = await client.connect();
  return mongoDbConnection;
}

function getConnection(){
  return mongoDbConnection;
}

function close(){
    mongoDbConnection.close();
}

module.exports = {
  connect,
  getConnection,
  close
};
