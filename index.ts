import app from './server';
import config from './config/config';
import { connectToServer } from './database/connection';

import logger from './config/logger';

const server = require('http').createServer(app);

// connect to database
connectToServer().then(() => {
  console.log('database connected');

  server.listen(config.port, () => {
    console.info(`Listening to port ${config.port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};
const unexpectedErrorHandler = (error: Error) => {
  logger.error(error);
  exitHandler();
};
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
