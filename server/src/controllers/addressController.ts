import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Address from '../models/Address';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';

export const getAddresses = catchAsync(async (req: AuthRequest, res: Response) => {
  const addresses = await Address.find({ user: req.user?._id })
    .sort({ isDefault: -1, createdAt: -1 })
    .lean();
    
  res.json({
    success: true,
    message: 'Addresses retrieved successfully',
    data: addresses
  });
});

export const addAddress = catchAsync(async (req: AuthRequest, res: Response) => {
  const { fullName, phoneNumber, addressLine, city, state, postalCode, isDefault } = req.body;
  
  if (isDefault) {
    await Address.updateMany({ user: req.user?._id }, { isDefault: false });
  }
  
  const address = new Address({
    user: req.user?._id,
    fullName,
    phoneNumber,
    addressLine,
    city,
    state,
    postalCode,
    isDefault: isDefault || false
  });
  
  await address.save();
  
  res.status(201).json({
    success: true,
    message: 'Address added successfully',
    data: address
  });
});

export const deleteAddress = catchAsync(async (req: AuthRequest, res: Response) => {
  const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user?._id }).lean();
  if (!address) {
    throw new AppError('Address not found', 404, 'ADDRESS_NOT_FOUND');
  }
  
  res.json({
    success: true,
    message: 'Address removed successfully',
    data: null
  });
});
