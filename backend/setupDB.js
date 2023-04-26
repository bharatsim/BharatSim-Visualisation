/* eslint-disable no-console */
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const mongoService = require('./src/services/mongoService');

const {
  DB_USER,
  DB_PORT,
  DB_HOST,
  DB_PASS,
  MONGO_INITDB_ROOT_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD,
} = process.env;
const DATABASE = 'bharatSim';

const ADMIN_DATABASE_URI = `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${DB_HOST}:${DB_PORT}/${DATABASE}?authSource=admin&readPreference=primary&ssl=false`;
const DATABASE_URI = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DATABASE}?authSource=admin&readPreference=primary&ssl=false`;


async function createNewUser() {
  if(DB_USER === MONGO_INITDB_ROOT_USERNAME){
      throw Error('#### Database - Root user and DB user name should be different, change DB_USER config from .env');
  }
  const client = new MongoClient(ADMIN_DATABASE_URI, { useUnifiedTopology: true });
  const mongoDbConnection = await client.connect();
  const db = mongoDbConnection.db();
  const admin = db.admin();
  try {
    await admin.addUser(DB_USER, DB_PASS, {
      roles: [{ role: 'readWrite', db: DATABASE }],
    });
    console.log('#### database - user created ####');
  } catch (e) {
    console.log('#### database - user already present ####');
  }
  await mongoDbConnection.close();
  await client.close();
}

createNewUser()
  .then(() => {
    mongoose.connect(DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.set('useCreateIndex', true);
    const db = mongoose.connection;
    db.on('error', () => {
      console.log('#### database - connection unsuccessful ####');
    });
    db.once('open', () => {
      console.log('#### database - connection successful ####');
    });

    mongoService
      .connect(DATABASE_URI)
      .then(() => {
        console.log('#### Mongo client connected successfully ####');
      })
      .catch((err) => {
        console.log('#### Mongo client connection unsuccessful ####', err);
      });
  })
  .catch((error) => {
    console.log(error);
  });
