import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  textileId: { type: String, required: true },
  vendorId: { type: String },
  vendorName: { type: String },
  collectionPointId: { type: String },
  selectedPath: { type: String, required: true }, // 'sell' | 'reuse' | 'disposal'
  material: { type: String, required: true },
  quantityKg: { type: Number, required: true },
  condition: { type: String, default: 'Good condition' },
  pickupLocation: {
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    placeId: { type: String }
  },
  destinationLocation: {
    name: { type: String, required: true },
    address: { type: String },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    placeId: { type: String }
  },
  status: {
    type: String,
    enum: ['SUBMITTED', 'MATCHED', 'VENDOR_ACCEPTED', 'PICKUP_SCHEDULED', 'PICKED_UP', 'PROCESSING', 'COMPLETED'],
    default: 'SUBMITTED'
  },
  estimatedPrice: { type: String },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const Order = mongoose.model('Order', orderSchema);
