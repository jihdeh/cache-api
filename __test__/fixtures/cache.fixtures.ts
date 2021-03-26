import { nanoid } from 'nanoid';
import { getCollection } from '../../database/connection';

type Ipayload = {
  ttl: number;
  data: object;
  date: Date;
  key: string;
};

export const insertCacheEntry = async ({
  ttl = 50,
  data = {},
  date = new Date(),
  key = nanoid(),
}: Ipayload) => {
  const cacheCollection = getCollection().cache;
  return await cacheCollection.insertOne({
    ttl,
    data,
    date,
    key,
  });
};

export const insertManyCacheEntries = async (records: Ipayload[]) => {
  const cacheCollection = getCollection().cache;
  return await cacheCollection.insertMany(records);
};

export const deleteManyEntries = async () => {
  const cacheCollection = getCollection().cache;
  return await cacheCollection.deleteMany({});
};
