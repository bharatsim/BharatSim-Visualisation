/* eslint-disable */
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoService = require('../src/services/mongoService');
const TEST_FILE_UPLOAD_PATH = './test/testUpload';
const fs = require('fs');

mongoose.set('useCreateIndex', true);

const mongod = new MongoMemoryServer();
let mongoDbConnection;

/**
 * Connect to the in-memory database.
 */
const connect = async () => {
  const uri = await mongod.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  await mongoose.connect(uri, mongooseOpts);
};

/**
 * Drop database, close the connection and stop mongod.
 */
const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongoDbConnection) {
    await mongoDbConnection.close();
  }
  await mongod.stop();
};

/**
 * Remove all the data for all db collections.
 */
const clearDatabase = async () => {
  const { collections } = mongoose.connection;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
  if (!mongoDbConnection) {
    return;
  }
  const db = mongoDbConnection.db();
  await db.dropDatabase();
};

function clearTestUpload(extension) {
  if (fs.existsSync(`${TEST_FILE_UPLOAD_PATH}-${extension}`)) {
    return fs.rmSync(`${TEST_FILE_UPLOAD_PATH}-${extension}`, { recursive: true });
  }
}

function createTestUploadFolder(extension) {
  if (!fs.existsSync(`${TEST_FILE_UPLOAD_PATH}-${extension}`)) {
    fs.mkdirSync(`${TEST_FILE_UPLOAD_PATH}`);
  }
}

const connectUsingMongo = async () => {
  const uri = await mongod.getUri();
  mongoDbConnection = await mongoService.connect(uri);
  return mongoDbConnection;
};

module.exports = {
  connect,
  clearDatabase,
  closeDatabase,
  connectUsingMongo,
  clearTestUpload,
  createTestUploadFolder,
  TEST_FILE_UPLOAD_PATH,
};
