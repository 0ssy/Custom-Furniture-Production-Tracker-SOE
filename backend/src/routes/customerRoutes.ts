
import express from "express";
import { authorize } from "../middleware/authMiddleware.js";

import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";

const router = express.Router();

router.post(
  "/",
  authorize("Administrator", "Manager", "Sales"),
  createCustomer
);

router.get(
  "/",
  authorize("Administrator", "Manager", "Sales", "Production", "Delivery"),
  getAllCustomers
);

router.get(
  "/:id",
  authorize("Administrator", "Manager", "Sales", "Production", "Delivery"),
  getCustomerById
);

router.put(
  "/:id",
  authorize("Administrator", "Manager", "Sales"),
  updateCustomer
);

router.delete(
  "/:id",
  authorize("Administrator"),
  deleteCustomer
);

export default router;
