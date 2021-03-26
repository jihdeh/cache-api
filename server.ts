import express from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import config from './config/config';
import { successWriteHandler, errorWriteHandler } from './config/morgan';
import cacheRoute from './src/routes/cache.route';
import { errorConverter, errorHandler } from './src/middlewares/error';
import ApiError from './src/utils/ApiError';

const app = express();

if (config.env !== 'test') {
  app.use(successWriteHandler);
  app.use(errorWriteHandler);
}

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// cache api routes
app.use('/cache', cacheRoute);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
