import type { Request, Response } from "express";
import Production from "../models/Production.js";

// Create production record
export const createProduction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { order, productionStatus, startDate, completionDate, notes } =
      req.body;

    if (!order) {
      res.status(400).json({
        message: "Order reference is required",
      });
      return;
    }

    const production = await Production.create({
      order,
      productionStatus,
      startDate,
      completionDate,
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
    const production = await Production.findById(req.params.id).populate(
      "order"
    );

    if (!production) {
      res.status(404).json({
        message: "Production record not found",
      });
      return;
    }

    res.status(200).json({ production });
  } catch (error) {
    console.error("Error fetching production record:", error);

    res.status(400).json({
      message: "Invalid production record ID",
    });
  }
};

// Update production record
export const updateProduction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updates = { ...req.body };

    const production = await Production.findByIdAndUpdate(
      req.params.id,
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
    const production = await Production.findByIdAndDelete(req.params.id);

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

    res.status(400).json({
      message: "Invalid production record ID",
    });
  }
};