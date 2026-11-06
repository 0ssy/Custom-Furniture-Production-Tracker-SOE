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

// Create order
router.post("/", createOrder);

// Get all orders
router.get("/", getAllOrders);

// Get one order by ID
router.get("/:id", getOrderById);

// Update order
router.put("/:id", updateOrder);

// Only Admin can delete orders
router.delete("/:id", authorize("Admin"), deleteOrder);

export default router;