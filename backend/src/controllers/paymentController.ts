import type { Request, Response } from "express";
import mongoose from "mongoose";
import Payment from "../models/Payment.js";

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
    const payment = await Payment.findById(req.params.id).populate("order");

    if (!payment) {
      res.status(404).json({
        message: "Payment not found",
      });
      return;
    }

    res.status(200).json({ payment });
  } catch (error) {
    console.error("Error fetching payment:", error);

    res.status(400).json({
      message: "Invalid payment ID",
    });
  }
};

// Update a payment
export const updatePayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updates = { ...req.body };

    // Prevent changing the payment's creation date
    delete updates.paymentDate;

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).populate("order");

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
    const payment = await Payment.findByIdAndDelete(req.params.id);

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

    res.status(400).json({
      message: "Invalid payment ID",
    });
  }
};