
import type { Request, Response } from "express";
import Customer from "../models/Customer.js";

// Register a new customer
export const createCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get customer information from the request
    const { fullName, email, phone, address } = req.body;

    // Check that all required fields are provided
    if (
      typeof fullName !== "string" ||
      typeof email !== "string" ||
      typeof phone !== "string" ||
      typeof address !== "string" ||
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !address.trim()
    ) {
      res.status(400).json({
        message: "All customer fields are required",
      });
      return;
    }

    // Check whether the email is already registered
    const existingCustomer = await Customer.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingCustomer) {
      res.status(409).json({
        message: "A customer with this email already exists",
      });
      return;
    }

    // Create and save the customer
    const customer = await Customer.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address: address.trim(),
    });

    // Send a successful response
    res.status(201).json({
      message: "Customer created successfully",
      customer,
    });
  } catch (error) {
    // Handle duplicate email errors from MongoDB
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      res.status(409).json({
        message: "A customer with this email already exists",
      });
      return;
    }

    console.error("Error creating customer:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
