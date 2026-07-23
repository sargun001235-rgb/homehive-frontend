import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Address from '../models/Address';

export const getAddresses = async (req: AuthRequest, res: Response) => {
  try {
    const addresses = await Address.find({ user: req.user?._id }).sort({ isDefault: -1, createdAt: -1 });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching addresses', error });
  }
};

export const addAddress = async (req: AuthRequest, res: Response) => {
  try {
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
    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ message: 'Error adding address', error });
  }
};

export const deleteAddress = async (req: AuthRequest, res: Response) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user?._id });
    if (!address) return res.status(404).json({ message: 'Address not found' });
    res.json({ message: 'Address removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing address', error });
  }
};
