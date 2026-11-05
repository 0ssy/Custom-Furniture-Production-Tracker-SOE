
import type { Request, Response } from "express";
import Material from "../models/Material.js";

// Create a new material
export const createMaterial = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const material = await Material.create(req.body);

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
    const material = await Material.findById(req.params.id);

    if (!material) {
      res.status(404).json({
        message: "Material not found",
      });
      return;
    }

    res.status(200).json({ material });
  } catch (error) {
    console.error("Error fetching material:", error);

    res.status(400).json({
      message: "Invalid material ID",
    });
  }
};

// Update a material
export const updateMaterial = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      req.body,
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
    const material = await Material.findByIdAndDelete(req.params.id);

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

    res.status(400).json({
      message: "Invalid material ID",
    });
  }
};
