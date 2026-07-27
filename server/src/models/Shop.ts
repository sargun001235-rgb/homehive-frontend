import mongoose, { Document, Schema } from 'mongoose';

export interface IShop extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  logo?: string;
  banner?: string;
  category: string;
  description: string;
  city: string;
  address: string;
  phone: string;
  businessHours: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
  };
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const shopSchema = new Schema<IShop>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true, trim: true },
    logo: { type: String, default: '' },
    banner: { type: String, default: '' },
    category: { type: String, required: true },
    description: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    businessHours: { type: String, required: true },
    socialLinks: {
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
    },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

shopSchema.index({ city: 1 });
shopSchema.index({ category: 1 });

export const Shop = mongoose.model<IShop>('Shop', shopSchema);
