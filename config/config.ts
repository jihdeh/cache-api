import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config({ path: path.join(__dirname, '../.env') });

const envVarsSchema = Joi.object()
  .keys({
    ENV: Joi.string().valid('production', 'development', 'staging', 'test').required(),
    PORT: Joi.number().default(3000),
    DBNAME: Joi.string().required().description('database name'),
    DEV_DATABASE_URL: Joi.string().required().description('Dev database url'),
    STAGING_DATABASE_URL: Joi.string().required().description('staging database url'),
    DATABASE_URL: Joi.string().required().description('database url'),
    TTL: Joi.number().description('TTL seconds'),
    MAX_CACHE_SIZE: Joi.number().description('Max cache size limit'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  env: envVars.ENV,
  ttl: envVars.TTL,
  maxCacheSize: envVars.MAX_CACHE_SIZE,
  port: envVars.PORT,
  dbName: envVars.DBNAME,
  devDatabaseUrl: envVars.DEV_DATABASE_URL,
  stagingDatabaseUrl: envVars.STAGING_DATABASE_URL,
  prodDatabaseUrl: envVars.DATABASE_URL,
};
