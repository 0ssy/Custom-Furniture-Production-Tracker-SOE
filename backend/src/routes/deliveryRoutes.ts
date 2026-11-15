
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

router.post(
  "/",
  authorize("Administrator", "Manager", "Delivery"),
  createDelivery
);

router.get(
  "/",
  authorize("Administrator", "Manager", "Delivery", "Sales", "Production"),
  getAllDeliveries
);

router.get(
  "/:id",
  authorize("Administrator", "Manager", "Delivery", "Sales", "Production"),
  getDeliveryById
);

router.put(
  "/:id",
  authorize("Administrator", "Manager", "Delivery"),
  updateDelivery
);

router.delete(
  "/:id",
  authorize("Administrator"),
  deleteDelivery
);

export default router;
