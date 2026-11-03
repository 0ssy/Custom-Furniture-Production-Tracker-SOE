
import express from "express";
import { createCustomer } from "../controllers/customerController.js";

const router = express.Router();

// Register a new customer
router.post("/", createCustomer);

export default router;
