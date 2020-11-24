/* eslint-disable */
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoService = require('../src/services/mongoService')

mongoose.set('useCreateIndex', true);

const mongod = new MongoMemoryServer();

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
};

const connectUsingMongo = async () => {
  const uri = await mongod.getUri();
  await mongoService.connect(uri);
};

module.exports = {
  connect,
  clearDatabase,
  closeDatabase,
  connectUsingMongo
};
