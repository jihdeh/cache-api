import { Db, MongoClient } from 'mongodb';
import { connectToServer } from '../../database/connection';

const setupTestDB = () => {
  let client: MongoClient | undefined;
  let database: Db | undefined;
  beforeAll(async (done) => {
    let res = await connectToServer();
    client = res?.client;
    database = res?.database;
    done();
  });

  beforeEach(async () => {
    // @todo refactor hardcoded cache collection value
    database?.collection('cache').deleteMany({});
  });

  afterAll(async (done) => {
    await client?.close();
    done();
  });
};

export default setupTestDB;
