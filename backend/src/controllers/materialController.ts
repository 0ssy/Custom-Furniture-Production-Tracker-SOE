
import type { Request, Response } from "express";
import mongoose from "mongoose";
import Material from "../models/Material.js";

const allowedCategories = [
  "Timber",
  "Hardware",
  "Fabric",
  "Finishing",
  "Other",
];

const allowedUnits = [
  "Pieces",
  "Metres",
  "Sheets",
  "Litres",
  "Kilograms",
];

// Create a new material
export const createMaterial = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      description,
      category,
      unit,
      quantityInStock,
      unitCost,
      reorderLevel,
    } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      typeof category !== "string" ||
      !allowedCategories.includes(category) ||
      typeof unit !== "string" ||
      !allowedUnits.includes(unit) ||
      typeof unitCost !== "number" ||
      !Number.isFinite(unitCost) ||
      unitCost < 0 ||
      (quantityInStock !== undefined &&
        (typeof quantityInStock !== "number" ||
          !Number.isFinite(quantityInStock) ||
          quantityInStock < 0)) ||
      (reorderLevel !== undefined &&
        (typeof reorderLevel !== "number" ||
          !Number.isFinite(reorderLevel) ||
          reorderLevel < 0))
    ) {
      res.status(400).json({
        message: "Please provide valid material details",
      });
      return;
    }

    const material = await Material.create({
      name: name.trim(),
      description: description.trim(),
      category,
      unit,
      quantityInStock: quantityInStock ?? 0,
      unitCost,
      reorderLevel: reorderLevel ?? 0,
    });

    res.status(201).json({
      message: "Material created successfully",
      material,
    });
  } catch (error) {
    console.error("Error creating material:", error);

    res.status(400).json({
      message: "Could not create material",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get all materials
export const getAllMaterials = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const materials = await Material.find();

    res.status(200).json({
      count: materials.length,
      materials,
    });
  } catch (error) {
    console.error("Error fetching materials:", error);

    res.status(500).json({
      message: "Could not retrieve materials",
    });
  }
};

// Get one material by ID
export const getMaterialById = async (
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
        message: "Invalid material ID",
      });
      return;
    }

    const material = await Material.findById(id);

    if (!material) {
      res.status(404).json({
        message: "Material not found",
      });
      return;
    }

    res.status(200).json({ material });
  } catch (error) {
    console.error("Error fetching material:", error);

    res.status(500).json({
      message: "Could not retrieve material",
    });
  }
};

// Update a material
export const updateMaterial = async (
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
        message: "Invalid material ID",
      });
      return;
    }

    const updates = { ...req.body };

    const allowedFields = [
      "name",
      "description",
      "category",
      "unit",
      "quantityInStock",
      "unitCost",
      "reorderLevel",
    ];

    const suppliedFields = Object.keys(updates);

    if (
      suppliedFields.length === 0 ||
      suppliedFields.some((field) => !allowedFields.includes(field))
    ) {
      res.status(400).json({
        message: "Provide valid material fields to update",
      });
      return;
    }

    if (updates.name !== undefined) {
      if (
        typeof updates.name !== "string" ||
        !updates.name.trim()
      ) {
        res.status(400).json({
          message: "Material name cannot be empty",
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
          message: "Material description cannot be empty",
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
          message: "Invalid material category",
        });
        return;
      }
    }

    if (updates.unit !== undefined) {
      if (
        typeof updates.unit !== "string" ||
        !allowedUnits.includes(updates.unit)
      ) {
        res.status(400).json({
          message: "Invalid material unit",
        });
        return;
      }
    }

    const numericFields = [
      "quantityInStock",
      "unitCost",
      "reorderLevel",
    ];

    for (const field of numericFields) {
      const value = updates[field];

      if (
        value !== undefined &&
        (typeof value !== "number" ||
          !Number.isFinite(value) ||
          value < 0)
      ) {
        res.status(400).json({
          message: `${field} must be a valid non-negative number`,
        });
        return;
      }
    }

    const material = await Material.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!material) {
      res.status(404).json({
        message: "Material not found",
      });
      return;
    }

    res.status(200).json({
      message: "Material updated successfully",
      material,
    });
  } catch (error) {
    console.error("Error updating material:", error);

    res.status(400).json({
      message: "Could not update material",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete a material
export const deleteMaterial = async (
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
        message: "Invalid material ID",
      });
      return;
    }

    const material = await Material.findByIdAndDelete(id);

    if (!material) {
      res.status(404).json({
        message: "Material not found",
      });
      return;
    }

    res.status(200).json({
      message: "Material deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting material:", error);

    res.status(500).json({
      message: "Could not delete material",
    });
  }
};
