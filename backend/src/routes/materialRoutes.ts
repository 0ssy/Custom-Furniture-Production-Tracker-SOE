import { authorize } from "../middleware/authMiddleware.js";
import express from "express";

import {
  createMaterial,
  getAllMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
} from "../controllers/materialController.js";

const router = express.Router();

// Create material
router.post("/", createMaterial);

// Get all materials
router.get("/", getAllMaterials);

// Get one material by ID
router.get("/:id", getMaterialById);

// Update material
router.put("/:id", updateMaterial);

// Delete material
router.delete("/:id", authorize("Admin"), deleteMaterial);

export default router;
