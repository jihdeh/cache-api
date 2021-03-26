import { MongoClientOptions } from 'mongodb';
import dbConfig from './config';

export type IDbConfig = {
  [key in keyof typeof dbConfig]: {
    url: string;
    options: MongoClientOptions;
  };
};

export type TEnv = keyof typeof dbConfig;
