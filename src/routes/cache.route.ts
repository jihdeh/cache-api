import express from 'express';
import {
  upsertCache,
  createCache,
  deleteAll,
  deleteCache,
  getAll,
  getCache,
} from '../controllers/cache.controller';

const router = express.Router();

router.route('/').get(getAll).post(createCache).delete(deleteAll);

router.route('/:key').get(getCache).put(upsertCache).delete(deleteCache);

export default router;
