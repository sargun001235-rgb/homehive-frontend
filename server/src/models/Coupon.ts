import mongoose, { Document, Schema } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  shopId: mongoose.Types.ObjectId;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, uppercase: true, trim: true },
    shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    minOrderValue: { type: Number, min: 0 },
    maxDiscount: { type: Number, min: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    usageLimit: { type: Number, min: 1 },
    usedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Ensure coupon codes are unique per shop
couponSchema.index({ code: 1, shopId: 1 }, { unique: true });

export const Coupon = mongoose.model<ICoupon>('Coupon', couponSchema);
