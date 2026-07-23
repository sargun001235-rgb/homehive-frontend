import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, phone, city, address } = req.body;

    if (!name || !email || !password || !role || !phone || !city || !address) {
      res.status(400).json({ message: 'Please provide all required fields' });
      return;
    }

    if (role !== 'customer' && role !== 'seller') {
      res.status(400).json({ message: 'Invalid role provided' });
      return;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
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

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
      return;
    } else {
      res.status(400).json({ message: 'Invalid user data' });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
    return;
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Please provide email and password' });
      return;
    }

    const user = await User.findOne({ email }).select('+password');

    if (user && (await bcrypt.compare(password, user.password as string))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
      return;
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
    return;
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user' });
  }
};
