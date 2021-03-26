import request from 'supertest';
import httpStatus, { extra } from 'http-status';

import app from '../../server';
import setupTestDB from '../utils/setupTestDB';
import { deleteManyEntries, insertCacheEntry } from '../fixtures/cache.fixtures';
import { nanoid } from 'nanoid';
import config from '../../config/config';
import { getCollection } from '../../database/connection';

setupTestDB();
jest.useFakeTimers();
const twentyFourhrs = 60 * 60 * 24 * 1000;
const ttl = config.ttl || twentyFourhrs;

describe('Cache Requests', () => {
  const cacheEntry = {
    ttl: 2,
    data: {
      name: 'Power',
    },
    date: new Date(),
    key: nanoid(),
  };

  afterEach(async () => {
    await deleteManyEntries();
  });

  test('should return all cache entries', async () => {
    await insertCacheEntry(cacheEntry);
    await insertCacheEntry({ ...cacheEntry, key: nanoid() });

    const res = await request(app).get('/cache').expect(httpStatus.OK);

    expect(res.body).toHaveLength(2);
  });

  test('should return a single cache entry', async () => {
    await insertCacheEntry(cacheEntry);

    const res = await request(app).get(`/cache/${cacheEntry.key}`).expect(httpStatus.OK);

    const result = res.body;
    expect(result.data).toEqual(cacheEntry.data);
    expect(result.ttl).toEqual(cacheEntry.ttl);
    expect(result.key).toEqual(cacheEntry.key);
  });

  test('should create a new key if key not found in cache', async () => {
    const key = 'random-key';
    const result = await request(app).get(`/cache/${key}`).expect(httpStatus.OK);

    expect(result.body).toBeDefined();

    const cacheCollection = getCollection().cache;
    const entry = await cacheCollection.findOne({ key });

    expect(entry?.key).toEqual(key);
    expect(entry?.data).toBeDefined();
    expect(entry?.ttl).toBeDefined();
    expect(entry?.date).toBeDefined();
  });

  test('should return create an entry', async () => {
    const res = await request(app).post('/cache').expect(httpStatus.OK);

    const result = res.body;
    expect(result.key).toBeDefined();
    expect(result.date).toBeDefined();
    expect(result.ttl).toBe(ttl);
  });

  test('should update an entry', async () => {
    await insertCacheEntry(cacheEntry);
    const payload = {
      name: 'Jason',
    };
    const res = await request(app)
      .put(`/cache/${cacheEntry.key}`)
      .send(payload)
      .expect(httpStatus.OK);

    const result = res.body;
    expect(result.data).toEqual(payload);
    expect(result.ttl).toEqual(ttl);
    expect(result.key).toEqual(cacheEntry.key);
  });

  test('should delete an entry', async () => {
    await insertCacheEntry(cacheEntry);

    await request(app).delete(`/cache/${cacheEntry.key}`).expect(httpStatus.OK);
    const cacheCollection = getCollection().cache;
    const entry = await cacheCollection.findOne({ key: cacheEntry.key });
    expect(entry).toBeNull();
  });

  test('should delete many entries', async () => {
    await insertCacheEntry(cacheEntry);
    await insertCacheEntry({ ...cacheEntry, key: nanoid() });

    await request(app).delete('/cache').expect(httpStatus.OK);

    const cacheCollection = getCollection().cache;
    const entries = await cacheCollection.find({}).toArray();
    expect(entries).toHaveLength(0);
  });

  test('should test for cache limit by removing last record', async () => {
    const leastKey = nanoid();
    await insertCacheEntry({ ...cacheEntry, key: leastKey });
    setTimeout(() => {
      console.log("Time's up -- stop!");
    }, 1500);

    await insertCacheEntry(cacheEntry);

    await request(app).post('/cache').expect(httpStatus.OK);

    const cacheCollection = getCollection().cache;
    const entries = await cacheCollection.find({}).toArray();
    expect(entries).toHaveLength(2);
    const entry = await cacheCollection.findOne({ key: leastKey });
    expect(entry).toBeNull();
  });

  test('should try to get expired ttl cache record', async () => {
    let date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    cacheEntry.date = date;
    await insertCacheEntry(cacheEntry);

    setTimeout(() => {
      console.log("Time's up -- stop!");
    }, 2000);

    await request(app).get(`/cache/${cacheEntry.key}`).expect(httpStatus.OK);

    const cacheCollection = getCollection().cache;
    const entry = await cacheCollection.findOne({ key: cacheEntry.key });

    expect(entry?.data).not.toEqual(cacheEntry.data);
    expect(entry?.date).not.toEqual(cacheEntry.date);
    expect(entry?.ttl).not.toEqual(cacheEntry.ttl);
    expect(entry?.ttl).toEqual(config.ttl);
  });
});
