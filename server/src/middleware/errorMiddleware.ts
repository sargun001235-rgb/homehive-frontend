import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

interface AppError extends Error {
  statusCode?: number;
  code?: string | number;
  errors?: any;
}

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';
  let details = null;
  let code = err.code || 'SERVER_ERROR';

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
    code = 'RESOURCE_NOT_FOUND';
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
    code = 'DUPLICATE_ERROR';
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    code = 'VALIDATION_ERROR';
    if (err.errors) {
        details = Object.values(err.errors).map((val: any) => val.message);
    }
  }

  // Zod validation error
  if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation Error';
    code = 'VALIDATION_ERROR';
    if (err.errors) {
      details = err.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`);
    }
  }

  // Log error
  if (statusCode >= 500) {
      logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip} - ${err.stack}`);
  } else {
      logger.warn(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
    error: {
      code,
      details: process.env.NODE_ENV === 'production' ? details : (details || err.stack),
    },
  });
};
