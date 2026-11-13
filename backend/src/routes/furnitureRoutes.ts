
import express from "express";
import { authorize } from "../middleware/authMiddleware.js";

import {
  createFurniture,
  getAllFurniture,
  getFurnitureById,
  updateFurniture,
  deleteFurniture,
} from "../controllers/furnitureController.js";

const router = express.Router();

router.post(
  "/",
  authorize("Administrator", "Manager"),
  createFurniture
);

router.get(
  "/",
  authorize("Administrator", "Manager", "Sales", "Production", "Delivery"),
  getAllFurniture
);

router.get(
  "/:id",
  authorize("Administrator", "Manager", "Sales", "Production", "Delivery"),
  getFurnitureById
);

router.put(
  "/:id",
  authorize("Administrator", "Manager"),
  updateFurniture
);

router.delete(
  "/:id",
  authorize("Administrator"),
  deleteFurniture
);

export default router;
