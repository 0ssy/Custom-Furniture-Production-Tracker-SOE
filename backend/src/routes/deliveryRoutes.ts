import { Router } from "express";
import { authorize } from "../middleware/authMiddleware.js";

import {
  createDelivery,
  getAllDeliveries,
  getDeliveryById,
  updateDelivery,
  deleteDelivery,
} from "../controllers/deliveryController.js";

const router = Router();

router.post("/", createDelivery);
router.get("/", getAllDeliveries);
router.get("/:id", getDeliveryById);
router.put("/:id", updateDelivery);
router.delete("/:id", authorize("Admin"), deleteDelivery);

export default router;