import express from "express";
import { authorize } from "../middleware/authMiddleware.js";

import {
  createProduction,
  getAllProduction,
  getProductionById,
  updateProduction,
  deleteProduction,
} from "../controllers/productionController.js";

const router = express.Router();

router.post("/", createProduction);
router.get("/", getAllProduction);
router.get("/:id", getProductionById);
router.put("/:id", updateProduction);
router.delete("/:id", authorize("Admin"), deleteProduction);

export default router;