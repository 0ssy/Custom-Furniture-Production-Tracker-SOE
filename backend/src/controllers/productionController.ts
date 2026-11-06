
import type { Request, Response } from "express";
import mongoose from "mongoose";

import Production from "../models/Production.js";
import Order from "../models/Order.js";

// Create production record
export const createProduction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      order,
      productionStatus,
      startDate,
      completionDate,
      notes,
    } = req.body;

    // Validate order reference
    if (!order || !mongoose.isValidObjectId(order)) {
      res.status(400).json({
        message: "Valid order reference is required",
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

    // Validate dates
    const parsedStartDate =
      startDate !== undefined ? new Date(startDate) : undefined;

    const parsedCompletionDate =
      completionDate !== undefined ? new Date(completionDate) : undefined;

    if (
      parsedStartDate &&
      Number.isNaN(parsedStartDate.getTime())
    ) {
      res.status(400).json({
        message: "Invalid production start date",
      });
      return;
    }

    if (
      parsedCompletionDate &&
      Number.isNaN(parsedCompletionDate.getTime())
    ) {
      res.status(400).json({
        message: "Invalid production completion date",
      });
      return;
    }

    if (
      parsedStartDate &&
      parsedCompletionDate &&
      parsedCompletionDate < parsedStartDate
    ) {
      res.status(400).json({
        message: "Completion date cannot be before the start date",
      });
      return;
    }

    const production = await Production.create({
      order,
      productionStatus,
      startDate: parsedStartDate,
      completionDate: parsedCompletionDate,
      notes,
    });

    res.status(201).json({
      message: "Production record created successfully",
      production,
    });
  } catch (error) {
    console.error("Error creating production record:", error);

    res.status(400).json({
      message: "Could not create production record",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get all production records
export const getAllProduction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const production = await Production.find().populate("order");

    res.status(200).json({
      count: production.length,
      production,
    });
  } catch (error) {
    console.error("Error fetching production records:", error);

    res.status(500).json({
      message: "Could not retrieve production records",
    });
  }
};

// Get one production record
export const getProductionById = async (
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
        message: "Invalid production record ID",
      });
      return;
    }

    const production = await Production.findById(id).populate("order");

    if (!production) {
      res.status(404).json({
        message: "Production record not found",
      });
      return;
    }

    res.status(200).json({ production });
  } catch (error) {
    console.error("Error fetching production record:", error);

    res.status(500).json({
      message: "Could not retrieve production record",
    });
  }
};

// Update production record
export const updateProduction = async (
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
        message: "Invalid production record ID",
      });
      return;
    }

    // Retrieve existing production record
    const existingProduction = await Production.findById(id);

    if (!existingProduction) {
      res.status(404).json({
        message: "Production record not found",
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

    // Validate updated dates
    let startDate = existingProduction.startDate;
    let completionDate = existingProduction.completionDate;

    if (updates.startDate !== undefined) {
      startDate = new Date(updates.startDate);

      if (Number.isNaN(startDate.getTime())) {
        res.status(400).json({
          message: "Invalid production start date",
        });
        return;
      }

      updates.startDate = startDate;
    }

    if (updates.completionDate !== undefined) {
      completionDate = new Date(updates.completionDate);

      if (Number.isNaN(completionDate.getTime())) {
        res.status(400).json({
          message: "Invalid production completion date",
        });
        return;
      }

      updates.completionDate = completionDate;
    }

    if (
      startDate &&
      completionDate &&
      completionDate < startDate
    ) {
      res.status(400).json({
        message: "Completion date cannot be before the start date",
      });
      return;
    }

    const production = await Production.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).populate("order");

    if (!production) {
      res.status(404).json({
        message: "Production record not found",
      });
      return;
    }

    res.status(200).json({
      message: "Production record updated successfully",
      production,
    });
  } catch (error) {
    console.error("Error updating production record:", error);

    res.status(400).json({
      message: "Could not update production record",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete production record
export const deleteProduction = async (
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
        message: "Invalid production record ID",
      });
      return;
    }

    const production = await Production.findByIdAndDelete(id);

    if (!production) {
      res.status(404).json({
        message: "Production record not found",
      });
      return;
    }

    res.status(200).json({
      message: "Production record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting production record:", error);

    res.status(500).json({
      message: "Could not delete production record",
    });
  }
};
