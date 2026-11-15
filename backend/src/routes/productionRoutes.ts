
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

router.post(
  "/",
  authorize("Administrator", "Manager", "Production"),
  createProduction
);

router.get(
  "/",
  authorize("Administrator", "Manager", "Production", "Sales", "Delivery"),
  getAllProduction
);

router.get(
  "/:id",
  authorize("Administrator", "Manager", "Production", "Sales", "Delivery"),
  getProductionById
);

router.put(
  "/:id",
  authorize("Administrator", "Manager", "Production"),
  updateProduction
);

router.delete(
  "/:id",
  authorize("Administrator"),
  deleteProduction
);

export default router;
