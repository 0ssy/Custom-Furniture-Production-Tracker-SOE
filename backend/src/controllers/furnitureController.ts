
import type { Request, Response } from "express";
import mongoose from "mongoose";
import Furniture from "../models/Furniture.js";

const allowedCategories = [
  "Chair",
  "Table",
  "Bed",
  "Sofa",
  "Cabinet",
  "Other",
];

// Validate furniture dimensions
const isValidDimensions = (dimensions: unknown): boolean => {
  if (
    typeof dimensions !== "object" ||
    dimensions === null ||
    Array.isArray(dimensions)
  ) {
    return false;
  }

  const values = dimensions as Record<string, unknown>;

  return (
    typeof values.length === "number" &&
    Number.isFinite(values.length) &&
    values.length > 0 &&
    typeof values.width === "number" &&
    Number.isFinite(values.width) &&
    values.width > 0 &&
    typeof values.height === "number" &&
    Number.isFinite(values.height) &&
    values.height > 0
  );
};

// Create a furniture item
export const createFurniture = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      description,
      category,
      basePrice,
      dimensions,
      isAvailable,
    } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      typeof category !== "string" ||
      !allowedCategories.includes(category) ||
      typeof basePrice !== "number" ||
      !Number.isFinite(basePrice) ||
      basePrice < 0 ||
      !isValidDimensions(dimensions) ||
      (isAvailable !== undefined && typeof isAvailable !== "boolean")
    ) {
      res.status(400).json({
        message: "Please provide valid furniture details",
      });
      return;
    }

    const furniture = await Furniture.create({
      name: name.trim(),
      description: description.trim(),
      category,
      basePrice,
      dimensions,
      isAvailable: isAvailable ?? true,
    });

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
    const id = req.params.id;

    if (
      typeof id !== "string" ||
      !mongoose.isValidObjectId(id)
    ) {
      res.status(400).json({
        message: "Invalid furniture ID",
      });
      return;
    }

    const furniture = await Furniture.findById(id);

    if (!furniture) {
      res.status(404).json({
        message: "Furniture not found",
      });
      return;
    }

    res.status(200).json({ furniture });
  } catch (error) {
    console.error("Error fetching furniture:", error);

    res.status(500).json({
      message: "Could not retrieve furniture",
    });
  }
};

// Update a furniture item
export const updateFurniture = async (
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
        message: "Invalid furniture ID",
      });
      return;
    }

    const updates = { ...req.body };

    const allowedFields = [
      "name",
      "description",
      "category",
      "basePrice",
      "dimensions",
      "isAvailable",
    ];

    const suppliedFields = Object.keys(updates);

    if (
      suppliedFields.length === 0 ||
      suppliedFields.some((field) => !allowedFields.includes(field))
    ) {
      res.status(400).json({
        message: "Provide valid furniture fields to update",
      });
      return;
    }

    if (updates.name !== undefined) {
      if (
        typeof updates.name !== "string" ||
        !updates.name.trim()
      ) {
        res.status(400).json({
          message: "Furniture name cannot be empty",
        });
        return;
      }

      updates.name = updates.name.trim();
    }

    if (updates.description !== undefined) {
      if (
        typeof updates.description !== "string" ||
        !updates.description.trim()
      ) {
        res.status(400).json({
          message: "Furniture description cannot be empty",
        });
        return;
      }

      updates.description = updates.description.trim();
    }

    if (updates.category !== undefined) {
      if (
        typeof updates.category !== "string" ||
        !allowedCategories.includes(updates.category)
      ) {
        res.status(400).json({
          message: "Invalid furniture category",
        });
        return;
      }
    }

    if (updates.basePrice !== undefined) {
      if (
        typeof updates.basePrice !== "number" ||
        !Number.isFinite(updates.basePrice) ||
        updates.basePrice < 0
      ) {
        res.status(400).json({
          message: "Base price must be a valid non-negative number",
        });
        return;
      }
    }

    if (updates.dimensions !== undefined) {
      if (!isValidDimensions(updates.dimensions)) {
        res.status(400).json({
          message: "All furniture dimensions must be positive numbers",
        });
        return;
      }
    }

    if (
      updates.isAvailable !== undefined &&
      typeof updates.isAvailable !== "boolean"
    ) {
      res.status(400).json({
        message: "Availability must be true or false",
      });
      return;
    }

    const furniture = await Furniture.findByIdAndUpdate(
      id,
      updates,
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
    const id = req.params.id;

    if (
      typeof id !== "string" ||
      !mongoose.isValidObjectId(id)
    ) {
      res.status(400).json({
        message: "Invalid furniture ID",
      });
      return;
    }

    const furniture = await Furniture.findByIdAndDelete(id);

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

    res.status(500).json({
      message: "Could not delete furniture",
    });
  }
};
