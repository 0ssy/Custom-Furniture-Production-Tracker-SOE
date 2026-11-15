
import express from "express";
import { authorize } from "../middleware/authMiddleware.js";

import {
  createMaterial,
  getAllMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
} from "../controllers/materialController.js";

const router = express.Router();

router.post(
  "/",
  authorize("Administrator", "Manager", "Production"),
  createMaterial
);

router.get(
  "/",
  authorize("Administrator", "Manager", "Sales", "Production", "Delivery"),
  getAllMaterials
);

router.get(
  "/:id",
  authorize("Administrator", "Manager", "Sales", "Production", "Delivery"),
  getMaterialById
);

router.put(
  "/:id",
  authorize("Administrator", "Manager", "Production"),
  updateMaterial
);

router.delete(
  "/:id",
  authorize("Administrator"),
  deleteMaterial
);

export default router;
