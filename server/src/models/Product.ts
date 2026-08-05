import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  shopId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  tags: string[];
  averageRating: number;
  numReviews: number;
  soldCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    images: [{ type: String }],
    tags: [{ type: String }],
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ shopId: 1 });
productSchema.index({ sellerId: 1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ soldCount: -1 });

export const Product = mongoose.model<IProduct>('Product', productSchema);
