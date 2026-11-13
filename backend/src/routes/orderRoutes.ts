
import express from "express";
import { authorize } from "../middleware/authMiddleware.js";

import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post(
  "/",
  authorize("Administrator", "Manager", "Sales"),
  createOrder
);

router.get(
  "/",
  authorize("Administrator", "Manager", "Sales", "Production", "Delivery"),
  getAllOrders
);

router.get(
  "/:id",
  authorize("Administrator", "Manager", "Sales", "Production", "Delivery"),
  getOrderById
);

router.put(
  "/:id",
  authorize("Administrator", "Manager", "Sales"),
  updateOrder
);

router.delete(
  "/:id",
  authorize("Administrator"),
  deleteOrder
);

export default router;
