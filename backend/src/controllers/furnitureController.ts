
import type { Request, Response } from "express";
import Furniture from "../models/Furniture.js";

// Create a furniture item
export const createFurniture = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const furniture = await Furniture.create(req.body);

    res.status(201).json({
      message: "Furniture created successfully",
      furniture,
    });
  } catch (error) {
    console.error("Error creating furniture:", error);

    res.status(400).json({
      message: "Could not create furniture",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get all furniture items
export const getAllFurniture = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const furniture = await Furniture.find();

    res.status(200).json({
      count: furniture.length,
      furniture,
    });
  } catch (error) {
    console.error("Error fetching furniture:", error);

    res.status(500).json({
      message: "Could not retrieve furniture",
    });
  }
};

// Get one furniture item by ID
export const getFurnitureById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const furniture = await Furniture.findById(req.params.id);

    if (!furniture) {
      res.status(404).json({
        message: "Furniture not found",
      });
      return;
    }

    res.status(200).json({ furniture });
  } catch (error) {
    console.error("Error fetching furniture:", error);

    res.status(400).json({
      message: "Invalid furniture ID",
    });
  }
};

// Update a furniture item
export const updateFurniture = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const furniture = await Furniture.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!furniture) {
      res.status(404).json({
        message: "Furniture not found",
      });
      return;
    }

    res.status(200).json({
      message: "Furniture updated successfully",
      furniture,
    });
  } catch (error) {
    console.error("Error updating furniture:", error);

    res.status(400).json({
      message: "Could not update furniture",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete a furniture item
export const deleteFurniture = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const furniture = await Furniture.findByIdAndDelete(req.params.id);

    if (!furniture) {
      res.status(404).json({
        message: "Furniture not found",
      });
      return;
    }

    res.status(200).json({
      message: "Furniture deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting furniture:", error);

    res.status(400).json({
      message: "Invalid furniture ID",
    });
  }
};
