import { Response, Request } from 'express';
import * as cacheService from '../services/cache.service';
import catchAsync from '../utils/catchAsync';

export const getAll = catchAsync(async (_: Request, res: Response) => {
  const result = await cacheService.getAll();
  return res.json(result);
});

export const deleteAll = catchAsync(async (_: Request, res: Response) => {
  const result = await cacheService.deleteAll();
  return res.send(result);
});

export const getCache = catchAsync(async (req: Request, res: Response) => {
  const key = req.params.key;
  const result = await cacheService.getCache(key);
  return res.json(result);
});

export const createCache = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;
  const nullKey = undefined;
  const result = await cacheService.createCache(nullKey, body);
  return res.send(result);
});

export const upsertCache = catchAsync(async (req: Request, res: Response) => {
  const key = req.params.key;
  const body = req.body;
  const result = await cacheService.upsertCache(key, body);
  return res.send(result);
});

export const deleteCache = catchAsync(async (req: Request, res: Response) => {
  const key = req.params.key;
  await cacheService.deleteCache(key);
  return res.send('OK');
});
