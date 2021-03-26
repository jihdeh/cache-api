import { Collection, MongoClient } from 'mongodb';
import config from '../config/config';
import dbConfig from './config';
import { IDbConfig, TEnv } from './d';

export type ICollectionProperty = { [key: string]: any };
interface dbCollection {
  [key: string]: Collection<ICollectionProperty>;
}

const client = new MongoClient(
  (dbConfig as IDbConfig)[config.env as TEnv].url,
  (dbConfig as IDbConfig)[config.env as TEnv].options,
);

const collection: dbCollection = {};
const documentName = {
  cache: true,
};

export async function connectToServer() {
  try {
    // Connect the client to the server
    await client.connect();

    // Establish and verify connection
    const database = client.db(config.dbName);
    for (const property in documentName) {
      collection[property] = database.collection(property);
      schemaIndexing[property](collection[property]);
    }
    return { database, client };
  } catch (error) {
    console.log(error); // log this error
    // Ensures that the client will close when it errors
    await client.close();
  }
}

export function getCollection() {
  return collection;
}

const schemaIndexing: ICollectionProperty = {
  cache: (collection: Collection<ICollectionProperty>) =>
    collection.createIndex({ key: 1 }, { unique: true }),
};
