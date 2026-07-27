import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Not authorized, no token', 401, 'NO_TOKEN'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;

    const user = await User.findById(decoded.id).select('-password').lean();
    if (!user) {
      return next(new AppError('Not authorized, user not found', 401, 'USER_NOT_FOUND'));
    }
    
    req.user = user as unknown as IUser;
    next();
  } catch (error) {
    return next(new AppError('Not authorized, token failed', 401, 'INVALID_TOKEN'));
  }
});

// Role Based Access Control middleware
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError(`User role ${req.user?.role} is not authorized to access this route`, 403, 'FORBIDDEN')
      );
    }
    next();
  };
};
