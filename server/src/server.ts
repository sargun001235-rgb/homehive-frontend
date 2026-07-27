import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import shopRoutes from './routes/shopRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import orderRoutes from './routes/orderRoutes';
import addressRoutes from './routes/addressRoutes';
import path from 'path';
import { upload } from './utils/upload';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import morgan from 'morgan';
import { notFound, errorHandler } from './middleware/errorMiddleware';
import logger from './utils/logger';

dotenv.config();

const app = express();

// Security HTTP headers
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: 'Too many requests from this IP, please try again in 15 minutes'
});
app.use('/api', limiter);

// Data sanitization
app.use(mongoSanitize());
app.use(xss());

// Logger
if (process.env.NODE_ENV !== 'test') {
  app.use(
    morgan('combined', {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    })
  );
}

// CORS
const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? process.env.CLIENT_URL
      : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/address', addressRoutes);

// Upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: `/${req.file.path.replace(/\\/g, '/')}`,
      },
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'No image uploaded',
    });
  }
});

// Static uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'API is running',
  });
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// MongoDB Connection
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing in environment variables.');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    app.listen(PORT, () => {
      logger.info(
        `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
      );
    });
  } catch (error: any) {
    logger.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  }
};

connectDB();