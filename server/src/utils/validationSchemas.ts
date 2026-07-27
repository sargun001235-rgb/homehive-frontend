import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['customer', 'seller']),
    phone: z.string().min(10, 'Phone must be at least 10 characters'),
    city: z.string().min(2, 'City is required'),
    address: z.string().min(5, 'Address is required'),
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  })
});

export const createShopSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    description: z.string().min(10),
    logo: z.string().optional(),
    coverImage: z.string().optional(),
    city: z.string().min(2),
  })
});

export const productSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    price: z.number().positive(),
    category: z.string().min(2),
    images: z.array(z.string()).min(1),
    stock: z.number().int().nonnegative(),
    tags: z.array(z.string()).optional(),
  })
});

export const addressSchema = z.object({
  body: z.object({
    fullName: z.string().min(2),
    phoneNumber: z.string().min(10),
    addressLine: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    postalCode: z.string().min(4),
    isDefault: z.boolean().optional(),
  })
});

export const orderSchema = z.object({
  body: z.object({
    shippingAddress: z.string().min(1),
    specialInstructions: z.string().optional(),
  })
});
