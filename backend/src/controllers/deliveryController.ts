
import type { Request, Response } from "express";
import mongoose from "mongoose";

import Delivery from "../models/Delivery.js";
import Order from "../models/Order.js";

// Create a delivery
export const createDelivery = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      order,
      deliveryAddress,
      deliveryDate,
      deliveryStatus,
      notes,
    } = req.body;

    // Validate required information
    if (
      !order ||
      !mongoose.isValidObjectId(order) ||
      typeof deliveryAddress !== "string" ||
      !deliveryAddress.trim() ||
      !deliveryDate
    ) {
      res.status(400).json({
        message: "Valid order, delivery address and delivery date are required",
      });
      return;
    }

    // Validate delivery date
    const parsedDeliveryDate = new Date(deliveryDate);

    if (Number.isNaN(parsedDeliveryDate.getTime())) {
      res.status(400).json({
        message: "Invalid delivery date",
      });
      return;
    }

    // Check that the order exists
    const orderExists = await Order.exists({ _id: order });

    if (!orderExists) {
      res.status(404).json({
        message: "Order not found",
      });
      return;
    }

    const delivery = await Delivery.create({
      order,
      deliveryAddress: deliveryAddress.trim(),
      deliveryDate: parsedDeliveryDate,
      deliveryStatus,
      notes,
    });

    res.status(201).json({
      message: "Delivery created successfully",
      delivery,
    });
  } catch (error) {
    console.error("Error creating delivery:", error);

    res.status(400).json({
      message: "Could not create delivery",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get all deliveries
export const getAllDeliveries = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deliveries = await Delivery.find().populate("order");

    res.status(200).json({
      count: deliveries.length,
      deliveries,
    });
  } catch (error) {
    console.error("Error retrieving deliveries:", error);

    res.status(500).json({
      message: "Could not retrieve deliveries",
    });
  }
};

// Get one delivery by ID
export const getDeliveryById = async (
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
        message: "Invalid delivery ID",
      });
      return;
    }

    const delivery = await Delivery.findById(id).populate("order");

    if (!delivery) {
      res.status(404).json({
        message: "Delivery not found",
      });
      return;
    }

    res.status(200).json({ delivery });
  } catch (error) {
    console.error("Error retrieving delivery:", error);

    res.status(500).json({
      message: "Could not retrieve delivery",
    });
  }
};

// Update a delivery
export const updateDelivery = async (
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
        message: "Invalid delivery ID",
      });
      return;
    }

    const updates = { ...req.body };

    // Validate updated order reference
    if (updates.order !== undefined) {
      if (!mongoose.isValidObjectId(updates.order)) {
        res.status(400).json({
          message: "Invalid order ID",
        });
        return;
      }

      const orderExists = await Order.exists({
        _id: updates.order,
      });

      if (!orderExists) {
        res.status(404).json({
          message: "Order not found",
        });
        return;
      }
    }

    // Validate updated delivery address
    if (updates.deliveryAddress !== undefined) {
      if (
        typeof updates.deliveryAddress !== "string" ||
        !updates.deliveryAddress.trim()
      ) {
        res.status(400).json({
          message: "Delivery address cannot be empty",
        });
        return;
      }

      updates.deliveryAddress = updates.deliveryAddress.trim();
    }

    // Validate updated delivery date
    if (updates.deliveryDate !== undefined) {
      const parsedDeliveryDate = new Date(updates.deliveryDate);

      if (Number.isNaN(parsedDeliveryDate.getTime())) {
        res.status(400).json({
          message: "Invalid delivery date",
        });
        return;
      }

      updates.deliveryDate = parsedDeliveryDate;
    }

    const delivery = await Delivery.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).populate("order");

    if (!delivery) {
      res.status(404).json({
        message: "Delivery not found",
      });
      return;
    }

    res.status(200).json({
      message: "Delivery updated successfully",
      delivery,
    });
  } catch (error) {
    console.error("Error updating delivery:", error);

    res.status(400).json({
      message: "Could not update delivery",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete a delivery
export const deleteDelivery = async (
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
        message: "Invalid delivery ID",
      });
      return;
    }

    const delivery = await Delivery.findByIdAndDelete(id);

    if (!delivery) {
      res.status(404).json({
        message: "Delivery not found",
      });
      return;
    }

    res.status(200).json({
      message: "Delivery deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting delivery:", error);

    res.status(500).json({
      message: "Could not delete delivery",
    });
  }
};
