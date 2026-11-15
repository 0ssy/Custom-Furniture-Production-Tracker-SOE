
import express from "express";
import { authorize } from "../middleware/authMiddleware.js";

import {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post(
  "/",
  authorize("Administrator", "Manager", "Sales"),
  createPayment
);

router.get(
  "/",
  authorize("Administrator", "Manager", "Sales", "Production", "Delivery"),
  getAllPayments
);

router.get(
  "/:id",
  authorize("Administrator", "Manager", "Sales", "Production", "Delivery"),
  getPaymentById
);

router.put(
  "/:id",
  authorize("Administrator", "Manager", "Sales"),
  updatePayment
);

router.delete(
  "/:id",
  authorize("Administrator"),
  deletePayment
);

export default router;
