import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

export const registerUser = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, role, phone, city, address } = req.body;

  if (!name || !email || !password || !role || !phone || !city || !address) {
    throw new AppError('Please provide all required fields', 400, 'MISSING_FIELDS');
  }

  if (role !== 'customer' && role !== 'seller') {
    throw new AppError('Invalid role provided', 400, 'INVALID_ROLE');
  }

  const userExists = await User.findOne({ email }).lean();
  if (userExists) {
    throw new AppError('User already exists', 400, 'USER_EXISTS');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    phone,
    city,
    address,
  });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    }
  });
});

export const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Please provide email and password', 400, 'MISSING_CREDENTIALS');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await bcrypt.compare(password, user.password as string))) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    }
  });
});

export const getMe = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  res.json({
    success: true,
    message: 'User retrieved successfully',
    data: user
  });
});
