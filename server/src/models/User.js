import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'seller'], default: 'buyer' },
  shopName: { type: String }, // Only for sellers
  shopDescription: { type: String },
  avatar: { type: String },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
