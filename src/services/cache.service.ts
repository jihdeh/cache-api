import { nanoid } from 'nanoid';
import { getCollection, ICollectionProperty } from '../../database/connection';
import config from '../../config/config';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';

const twentyFourhrs = 60 * 60 * 24 * 1000;
const ttl = config.ttl || twentyFourhrs;
const maxCacheSize = config.maxCacheSize || 5;

type ToptionalString = string | undefined;

export const getAll = async () => {
  const cacheCollection = getCollection().cache;
  const cacheResults = await cacheCollection.find({}).toArray();
  return cacheResults;
};

export const deleteAll = () => {
  const cacheCollection = getCollection().cache;
  return cacheCollection.deleteMany({});
};

const cacheExpired = ({
  ttl,
  date,
}: ICollectionProperty | { ttl: number; date: Date }): boolean => {
  return Boolean(Date.now() - date.getTime() >= 1000 * ttl);
};

const randomString = () => nanoid();

const newCachePayload = (key = randomString(), data: ToptionalString = randomString()) => {
  return {
    key,
    date: new Date(),
    ttl,
    data,
  };
};

export const createCache = async (key: ToptionalString, data: ToptionalString) => {
  const cacheCollection = getCollection().cache;
  const record = newCachePayload(key, data);
  let response = await cacheCollection.insertOne(record);

  return response.ops[0];
};

const retriveCacheCondtion = async function (key: string) {
  const cache = await getCacheRecord(key);
  const cacheCollection = getCollection().cache;
  if (cache) {
    console.log('Cache hit');
    if (cacheExpired(cache)) {
      await cacheCollection.deleteOne({ key });
      return createCache(key, cache.data);
    }
    return cache;
  } else {
    console.log('Cache miss');
    return createCache(key, undefined);
  }
};

export const getCache = (key: string) => {
  return retriveCacheCondtion(key);
};

/**
 * Filter and update cache by LRU - least recently used mechanism
 */
const lruMechanise = async () => {
  const cacheCollection = getCollection().cache;
  const caches = await getAll();
  if (caches.length >= maxCacheSize) {
    const record = await cacheCollection.find().sort({ date: 1 }).limit(1).toArray();
    if (record.length) {
      const pick = record[0];
      await cacheCollection.deleteOne({ key: pick.key });
    }
    return;
  }
  return;
};

export const upsertCache = async (key: string, data: string) => {
  try {
    const cacheCollection = getCollection().cache;
    const record = newCachePayload(key, data);
    await lruMechanise();
    await cacheCollection.updateOne({ key }, { $set: record }, { upsert: true });
    return getCacheRecord(key);
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, err);
  }
};

const getCacheRecord = (cacheKey: string) => {
  const cacheCollection = getCollection().cache;
  return cacheCollection.findOne({ key: cacheKey });
};

export const deleteCache = (key: string) => {
  const cacheCollection = getCollection().cache;
  return cacheCollection.deleteOne({ key });
};
