import { HttpStatusClasses, HttpStatusExtra } from 'http-status';

class ApiError extends Error {
  statusCode: number | string;
  isOperational: boolean;
  constructor(statusCode: string | number, message: any, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
