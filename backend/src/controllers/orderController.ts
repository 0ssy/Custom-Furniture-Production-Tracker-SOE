
import type { Request, Response } from "express";
import mongoose from "mongoose";

import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
import Furniture from "../models/Furniture.js";

// Create a new order
export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { customer, items, expectedDeliveryDate } = req.body;

    // Validate required information
    if (
      !customer ||
      !mongoose.isValidObjectId(customer) ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !expectedDeliveryDate
    ) {
      res.status(400).json({
        message:
          "Valid customer, order items and delivery date are required",
      });
      return;
    }

    // Validate expected delivery date
    const deliveryDate = new Date(expectedDeliveryDate);

    if (Number.isNaN(deliveryDate.getTime())) {
      res.status(400).json({
        message: "Invalid expected delivery date",
      });
      return;
    }

    // Check that delivery date is not before order date
    const orderDate = new Date();

    if (deliveryDate < orderDate) {
      res.status(400).json({
        message: "Expected delivery date cannot be before the order date",
      });
      return;
    }

    // Check that the customer exists
    const customerExists = await Customer.exists({ _id: customer });

    if (!customerExists) {
      res.status(404).json({
        message: "Customer not found",
      });
      return;
    }

    // Calculate order total
    let totalAmount = 0;

    for (const item of items) {
      if (
        !item ||
        !mongoose.isValidObjectId(item.furniture) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        typeof item.unitPrice !== "number" ||
        !Number.isFinite(item.unitPrice) ||
        item.unitPrice < 0
      ) {
        res.status(400).json({
          message:
            "Each order item must have valid furniture, quantity and unit price",
        });
        return;
      }

      // Check that the furniture exists
      const furnitureExists = await Furniture.exists({
        _id: item.furniture,
      });

      if (!furnitureExists) {
        res.status(404).json({
          message: `Furniture not found: ${item.furniture}`,
        });
        return;
      }

      totalAmount += item.quantity * item.unitPrice;
    }

    // Create order
    const order = await Order.create({
      customer,
      items,
      totalAmount,
      expectedDeliveryDate: deliveryDate,
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);

    res.status(400).json({
      message: "Could not create order",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get all orders
export const getAllOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate("customer")
      .populate("items.furniture");

    res.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);

    res.status(500).json({
      message: "Could not retrieve orders",
    });
  }
};

// Get one order by ID
export const getOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    if (
      typeof id !== "string" ||
      !mongoose.isValidObjectId(id)
    ) {
      res.status(400).json({
        message: "Invalid order ID",
      });
      return;
    }

    const order = await Order.findById(id)
      .populate("customer")
      .populate("items.furniture");

    if (!order) {
      res.status(404).json({
        message: "Order not found",
      });
      return;
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);

    res.status(500).json({
      message: "Could not retrieve order",
    });
  }
};

// Update an order
export const updateOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    if (
      typeof id !== "string" ||
      !mongoose.isValidObjectId(id)
    ) {
      res.status(400).json({
        message: "Invalid order ID",
      });
      return;
    }

    // Retrieve existing order
    const existingOrder = await Order.findById(id);

    if (!existingOrder) {
      res.status(404).json({
        message: "Order not found",
      });
      return;
    }

    const updates = { ...req.body };

    // Prevent clients from changing calculated or creation fields
    delete updates.totalAmount;
    delete updates.orderDate;

    // Check updated customer if provided
    if (updates.customer !== undefined) {
      if (!mongoose.isValidObjectId(updates.customer)) {
        res.status(400).json({
          message: "Invalid customer ID",
        });
        return;
      }

      const customerExists = await Customer.exists({
        _id: updates.customer,
      });

      if (!customerExists) {
        res.status(404).json({
          message: "Customer not found",
        });
        return;
      }
    }

    // Validate updated delivery date if provided
    if (updates.expectedDeliveryDate !== undefined) {
      const deliveryDate = new Date(updates.expectedDeliveryDate);

      if (Number.isNaN(deliveryDate.getTime())) {
        res.status(400).json({
          message: "Invalid expected delivery date",
        });
        return;
      }

      if (deliveryDate < existingOrder.orderDate) {
        res.status(400).json({
          message: "Expected delivery date cannot be before the order date",
        });
        return;
      }

      updates.expectedDeliveryDate = deliveryDate;
    }

    // Recalculate total if order items are changed
    if (updates.items !== undefined) {
      if (!Array.isArray(updates.items) || updates.items.length === 0) {
        res.status(400).json({
          message: "An order must contain at least one item",
        });
        return;
      }

      let totalAmount = 0;

      for (const item of updates.items) {
        if (
          !item ||
          !mongoose.isValidObjectId(item.furniture) ||
          !Number.isInteger(item.quantity) ||
          item.quantity < 1 ||
          typeof item.unitPrice !== "number" ||
          !Number.isFinite(item.unitPrice) ||
          item.unitPrice < 0
        ) {
          res.status(400).json({
            message:
              "Each order item must have valid furniture, quantity and unit price",
          });
          return;
        }

        // Check that updated furniture exists
        const furnitureExists = await Furniture.exists({
          _id: item.furniture,
        });

        if (!furnitureExists) {
          res.status(404).json({
            message: `Furniture not found: ${item.furniture}`,
          });
          return;
        }

        totalAmount += item.quantity * item.unitPrice;
      }

      updates.totalAmount = totalAmount;
    }

    const order = await Order.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .populate("customer")
      .populate("items.furniture");

    if (!order) {
      res.status(404).json({
        message: "Order not found",
      });
      return;
    }

    res.status(200).json({
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order:", error);

    res.status(400).json({
      message: "Could not update order",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete an order
export const deleteOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    if (
      typeof id !== "string" ||
      !mongoose.isValidObjectId(id)
    ) {
      res.status(400).json({
        message: "Invalid order ID",
      });
      return;
    }

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      res.status(404).json({
        message: "Order not found",
      });
      return;
    }

    res.status(200).json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error);

    res.status(500).json({
      message: "Could not delete order",
    });
  }
};
