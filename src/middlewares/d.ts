import { HttpStatusClasses, HttpStatusExtra } from 'http-status';

export type ErrorMessage = string | number | HttpStatusClasses | HttpStatusExtra;

export interface IError {
  name: string;
  message: ErrorMessage;
  stack?: string;
}

export interface ISetLocals extends Express.Response {
  status(statusCode: string | number | undefined): any;
  locals: {
    errorMessage: ErrorMessage;
  };
}
