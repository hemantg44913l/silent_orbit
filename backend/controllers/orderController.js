import { orderService } from '../services/orderService.js';

export const orderController = {
  createOrder: async (req, res, next) => {
    try {
      const newOrder = await orderService.createOrder(req.body);
      return res.status(201).json({
        success: true,
        message: 'Order created successfully.',
        data: newOrder
      });
    } catch (err) {
      next(err);
    }
  },

  getOrderById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const order = await orderService.getOrderById(id);
      if (!order) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'ORDER_NOT_FOUND',
            message: `Order or consignment tracking ID '${id}' was not found.`
          }
        });
      }
      return res.status(200).json({
        success: true,
        data: order
      });
    } catch (err) {
      next(err);
    }
  },

  getOrders: async (req, res, next) => {
    try {
      const orders = await orderService.getAllOrders();
      return res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
      });
    } catch (err) {
      next(err);
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await orderService.updateOrderStatus(id, status);
      return res.status(200).json({
        success: true,
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }
};
