import config from '../config/config';

export default {
  development: {
    url: config.devDatabaseUrl,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  test: {
    url: config.devDatabaseUrl,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  staging: {
    url: config.stagingDatabaseUrl,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  production: {
    url: config.prodDatabaseUrl,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};
