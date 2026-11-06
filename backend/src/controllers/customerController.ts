import type { Request, Response } from "express";
import mongoose from "mongoose";
import Customer from "../models/Customer.js";

// Create a customer
export const createCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { fullName, email, phone, address } = req.body;

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

    const customer = await Customer.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address: address.trim(),
    });

    res.status(201).json({
      message: "Customer created successfully",
      customer,
    });
  } catch (error) {
    const err = error as { code?: number };

    if (err.code === 11000) {
      res.status(409).json({
        message: "A customer with this email already exists",
      });
      return;
    }

    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({
        message: "Customer validation failed",
        error: error.message,
      });
      return;
    }

    res.status(500).json({
      message: "Failed to create customer",
    });
  }
};

// Get all customers
export const getAllCustomers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const customers = await Customer.find();

    res.status(200).json({
      count: customers.length,
      customers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve customers",
    });
  }
};

// Get one customer by ID
export const getCustomerById = async (
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
        message: "Invalid customer ID",
      });
      return;
    }

    const customer = await Customer.findById(id);

    if (!customer) {
      res.status(404).json({
        message: "Customer not found",
      });
      return;
    }

    res.status(200).json({ customer });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve customer",
    });
  }
};

// Update a customer
export const updateCustomer = async (
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
        message: "Invalid customer ID",
      });
      return;
    }

    const { fullName, email, phone, address } = req.body;

    const allowedFields = ["fullName", "email", "phone", "address"];
    const suppliedFields = Object.keys(req.body);

    if (
      suppliedFields.length === 0 ||
      suppliedFields.some((field) => !allowedFields.includes(field))
    ) {
      res.status(400).json({
        message: "Provide valid customer fields to update",
      });
      return;
    }

    const updates: {
      fullName?: string;
      email?: string;
      phone?: string;
      address?: string;
    } = {};

    if (fullName !== undefined) {
      if (typeof fullName !== "string" || !fullName.trim()) {
        res.status(400).json({
          message: "Customer name cannot be empty",
        });
        return;
      }
      updates.fullName = fullName.trim();
    }

    if (email !== undefined) {
      if (typeof email !== "string" || !email.trim()) {
        res.status(400).json({
          message: "Customer email cannot be empty",
        });
        return;
      }
      updates.email = email.trim().toLowerCase();
    }

    if (phone !== undefined) {
      if (typeof phone !== "string" || !phone.trim()) {
        res.status(400).json({
          message: "Customer phone number cannot be empty",
        });
        return;
      }
      updates.phone = phone.trim();
    }

    if (address !== undefined) {
      if (typeof address !== "string" || !address.trim()) {
        res.status(400).json({
          message: "Customer address cannot be empty",
        });
        return;
      }
      updates.address = address.trim();
    }

    const customer = await Customer.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!customer) {
      res.status(404).json({
        message: "Customer not found",
      });
      return;
    }

    res.status(200).json({
      message: "Customer updated successfully",
      customer,
    });
  } catch (error) {
    const err = error as { code?: number };

    if (err.code === 11000) {
      res.status(409).json({
        message: "A customer with this email already exists",
      });
      return;
    }

    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({
        message: "Customer validation failed",
        error: error.message,
      });
      return;
    }

    res.status(500).json({
      message: "Failed to update customer",
    });
  }
};

// Delete a customer
export const deleteCustomer = async (
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
        message: "Invalid customer ID",
      });
      return;
    }

    const customer = await Customer.findByIdAndDelete(id);

    if (!customer) {
      res.status(404).json({
        message: "Customer not found",
      });
      return;
    }

    res.status(200).json({
      message: "Customer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete customer",
    });
  }
};