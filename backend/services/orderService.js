import mongoose from 'mongoose';
import { Order } from '../models/Order.js';

// In-memory fallback array for orders if MongoDB Atlas is unreachable
const memoryOrders = [
  {
    _id: 'ord-10001',
    orderId: 'TXL-8940-2026',
    textileId: 'sub-8940',
    vendorName: 'EcoFiber Circular Solutions Hub',
    selectedPath: 'sell',
    material: '100% Pure Cotton',
    quantityKg: 45,
    condition: 'Usable condition',
    pickupLocation: { address: 'Austin, TX', latitude: 30.2672, longitude: -97.7431 },
    destinationLocation: { name: 'EcoFiber Circular Hub', address: '100 Circular Way, Austin, TX' },
    status: 'COMPLETED',
    estimatedPrice: '$83.25',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'ord-10002',
    orderId: 'TXL-8941-2026',
    textileId: 'sub-8941',
    vendorName: 'TexReclaim Industrial Shoddy Mill',
    selectedPath: 'sell',
    material: 'Denim & Canvas Offcuts',
    quantityKg: 120,
    condition: 'Scrap / Cutoffs',
    pickupLocation: { address: 'Round Rock, TX', latitude: 30.5083, longitude: -97.6789 },
    destinationLocation: { name: 'TexReclaim Facility', address: '450 Industrial Blvd, Round Rock, TX' },
    status: 'IN_TRANSIT',
    estimatedPrice: '$192.00',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'ord-10003',
    orderId: 'TXL-8942-2026',
    textileId: 'sub-8942',
    vendorName: 'PurePoly Thermal Recycling Plant',
    selectedPath: 'disposal',
    material: 'Polyester Blend',
    quantityKg: 85,
    condition: 'Mixed synthetic',
    pickupLocation: { address: 'San Marcos, TX', latitude: 29.8833, longitude: -97.9414 },
    destinationLocation: { name: 'PurePoly Plant', address: '78 Eco Park, San Marcos, TX' },
    status: 'SCHEDULED',
    estimatedPrice: '$80.75',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'ord-10004',
    orderId: 'TXL-8943-2026',
    textileId: 'sub-8943',
    vendorName: 'Circular Wool & Garnetting Co.',
    selectedPath: 'sell',
    material: 'Wool & Cashmere',
    quantityKg: 30,
    condition: 'Good condition',
    pickupLocation: { address: 'Cedar Park, TX', latitude: 30.5052, longitude: -97.8203 },
    destinationLocation: { name: 'Circular Wool Hub', address: '12 Wool St, Cedar Park, TX' },
    status: 'PROCESSING',
    estimatedPrice: '$63.00',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  }
];

export const orderService = {
  createOrder: async (data) => {
    if (!data.pickupLocation || !data.pickupLocation.address) {
      const error = new Error('Pickup location address is required');
      error.statusCode = 400;
      throw error;
    }

    let orderCount = memoryOrders.length;
    try {
      if (mongoose.connection.readyState === 1) {
        orderCount = await Order.countDocuments();
      }
    } catch (e) {
      // Use memory length
    }

    const orderIdNumber = 8940 + orderCount + 1;
    const orderId = data.orderId || `TXL-${orderIdNumber}-2026`;

    const orderData = {
      _id: new mongoose.Types.ObjectId().toString(),
      orderId,
      textileId: data.textileId || `sub-${Date.now().toString(36)}`,
      vendorId: data.vendorId || null,
      vendorName: data.vendorName || 'Target Recycling Facility',
      collectionPointId: data.collectionPointId || null,
      selectedPath: data.selectedPath || 'sell',
      material: data.material || 'Cotton',
      quantityKg: Number(data.quantityKg) || 15,
      condition: data.condition || 'Good condition',
      pickupLocation: {
        address: data.pickupLocation.address,
        latitude: Number(data.pickupLocation.latitude) || 30.2672,
        longitude: Number(data.pickupLocation.longitude) || -97.7431,
        placeId: data.pickupLocation.placeId || ''
      },
      destinationLocation: {
        name: data.destinationLocation?.name || data.vendorName || 'Recycling Logistics Hub',
        address: data.destinationLocation?.address || 'East Logistics Zone, Austin, TX',
        latitude: Number(data.destinationLocation?.latitude) || 30.2789,
        longitude: Number(data.destinationLocation?.longitude) || -97.6890,
        placeId: data.destinationLocation?.placeId || ''
      },
      status: data.status || 'SUBMITTED',
      estimatedPrice: data.estimatedPrice || '$25.00',
      notes: data.notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      if (mongoose.connection.readyState === 1) {
        const orderDoc = new Order(orderData);
        const saved = await orderDoc.save();
        memoryOrders.unshift(saved.toObject());
        return saved.toObject();
      }
    } catch (err) {
      console.warn('[orderService] Database save failed, storing in memory fallback:', err.message);
    }

    memoryOrders.unshift(orderData);
    return orderData;
  },

  getOrderById: async (orderId) => {
    if (!orderId) return null;
    const cleanId = orderId.trim().toUpperCase();

    try {
      if (mongoose.connection.readyState === 1) {
        const doc = await Order.findOne({
          $or: [
            { orderId: new RegExp(`^${cleanId}$`, 'i') },
            { _id: mongoose.isValidObjectId(cleanId) ? cleanId : null }
          ]
        }).lean();
        if (doc) return doc;
      }
    } catch (err) {
      console.warn('[orderService] DB search failed, searching memory fallback:', err.message);
    }

    return memoryOrders.find(o => 
      o.orderId.toUpperCase() === cleanId || 
      (o._id && o._id.toString() === cleanId)
    ) || null;
  },

  getAllOrders: async () => {
    try {
      if (mongoose.connection.readyState === 1) {
        return await Order.find().sort({ createdAt: -1 }).lean();
      }
    } catch (err) {
      // Fallback
    }
    return memoryOrders;
  },

  updateOrderStatus: async (orderId, newStatus) => {
    const cleanId = orderId.trim();
    try {
      if (mongoose.connection.readyState === 1) {
        const order = await Order.findOne({ orderId: cleanId });
        if (order) {
          order.status = newStatus;
          order.updatedAt = new Date();
          const saved = await order.save();
          return saved.toObject();
        }
      }
    } catch (err) {
      console.warn('[orderService] DB status update failed:', err.message);
    }

    const memOrder = memoryOrders.find(o => o.orderId === cleanId);
    if (memOrder) {
      memOrder.status = newStatus;
      memOrder.updatedAt = new Date();
      return memOrder;
    }

    const error = new Error(`Order ${orderId} not found`);
    error.statusCode = 404;
    throw error;
  }
};
