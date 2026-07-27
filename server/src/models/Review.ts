import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  product: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  photos: string[];
  likes: mongoose.Types.ObjectId[];
  verifiedPurchase: boolean;
  sellerResponse?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    photos: [{ type: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    verifiedPurchase: { type: Boolean, default: false },
    sellerResponse: { type: String, trim: true },
  },
  { timestamps: true }
);

// Prevent multiple reviews from same user on same product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ product: 1, rating: -1 });
reviewSchema.index({ createdAt: -1 });

export default mongoose.model<IReview>('Review', reviewSchema);
