import { authorize } from "../middleware/authMiddleware.js";
import express from "express";

import {
  createFurniture,
  getAllFurniture,
  getFurnitureById,
  updateFurniture,
  deleteFurniture,
} from "../controllers/furnitureController.js";

const router = express.Router();

// Create furniture
router.post("/", createFurniture);

// Get all furniture
router.get("/", getAllFurniture);

// Get one furniture item
router.get("/:id", getFurnitureById);

// Update furniture
router.put("/:id", updateFurniture);

// Delete furniture
router.delete("/:id", authorize("Admin"), deleteFurniture);

export default router;
