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

router.post("/", createCustomer);

router.get("/", getAllCustomers);

router.get("/:id", getCustomerById);

router.put("/:id", updateCustomer);

// Only Admin can delete customers
router.delete("/:id", authorize("Admin"), deleteCustomer);

export default router;