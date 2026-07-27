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
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 500, // limit each IP to 500 requests per windowMs
  message: 'Too many requests from this IP, please try again in 15 minutes'
});
app.use('/api', limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
      stream: { write: (message) => logger.info(message.trim()) }
  }));
}

const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.CLIENT_URL 
        : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));

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
      data: { url: `/${req.file.path.replace(/\\/g, '/')}` }
    });
  } else {
    res.status(400).json({ success: false, message: 'No image uploaded' });
  }
});

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

import { MongoMemoryServer } from 'mongodb-memory-server';

const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/homehive';
    
    try {
      const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
      logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (e) {
      logger.warn('Local MongoDB failed to connect. Falling back to Memory Server...');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      logger.info(`MongoDB Memory Server Connected: ${mongoUri}`);
    }
    
    app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error: any) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();
