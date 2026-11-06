
import type { Request, Response } from "express";
import mongoose from "mongoose";

import Payment from "../models/Payment.js";
import Order from "../models/Order.js";

// Create a new payment
export const createPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      order,
      amount,
      paymentMethod,
      transactionReference,
    } = req.body;

    if (
      !order ||
      !mongoose.isValidObjectId(order) ||
      typeof amount !== "number" ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !["Cash", "Bank Transfer", "Card", "Mobile Money"].includes(
        paymentMethod
      )
    ) {
      res.status(400).json({
        message: "Valid order, amount and payment method are required",
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

    const payment = await Payment.create({
      order,
      amount,
      paymentMethod,
      transactionReference,
    });

    res.status(201).json({
      message: "Payment recorded successfully",
      payment,
    });
  } catch (error) {
    console.error("Error creating payment:", error);

    res.status(400).json({
      message: "Could not record payment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get all payments
export const getAllPayments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const payments = await Payment.find().populate("order");

    res.status(200).json({
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);

    res.status(500).json({
      message: "Could not retrieve payments",
    });
  }
};

// Get one payment by ID
export const getPaymentById = async (
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
        message: "Invalid payment ID",
      });
      return;
    }

    const payment = await Payment.findById(id).populate("order");

    if (!payment) {
      res.status(404).json({
        message: "Payment not found",
      });
      return;
    }

    res.status(200).json({ payment });
  } catch (error) {
    console.error("Error fetching payment:", error);

    res.status(500).json({
      message: "Could not retrieve payment",
    });
  }
};

// Update a payment
export const updatePayment = async (
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
        message: "Invalid payment ID",
      });
      return;
    }

    const updates = { ...req.body };

    // Prevent changing the payment's creation date
    delete updates.paymentDate;

    // Validate updated order if provided
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

    // Validate updated amount if provided
    if (updates.amount !== undefined) {
      if (
        typeof updates.amount !== "number" ||
        !Number.isFinite(updates.amount) ||
        updates.amount <= 0
      ) {
        res.status(400).json({
          message: "Payment amount must be greater than zero",
        });
        return;
      }
    }

    // Validate updated payment method if provided
    if (updates.paymentMethod !== undefined) {
      if (
        !["Cash", "Bank Transfer", "Card", "Mobile Money"].includes(
          updates.paymentMethod
        )
      ) {
        res.status(400).json({
          message: "Invalid payment method",
        });
        return;
      }
    }

    const payment = await Payment.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("order");

    if (!payment) {
      res.status(404).json({
        message: "Payment not found",
      });
      return;
    }

    res.status(200).json({
      message: "Payment updated successfully",
      payment,
    });
  } catch (error) {
    console.error("Error updating payment:", error);

    res.status(400).json({
      message: "Could not update payment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete a payment
export const deletePayment = async (
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
        message: "Invalid payment ID",
      });
      return;
    }

    const payment = await Payment.findByIdAndDelete(id);

    if (!payment) {
      res.status(404).json({
        message: "Payment not found",
      });
      return;
    }

    res.status(200).json({
      message: "Payment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting payment:", error);

    res.status(500).json({
      message: "Could not delete payment",
    });
  }
};
