
import express from "express";
import cors from "cors";

import customerRoutes from "./routes/customerRoutes.js";
import furnitureRoutes from "./routes/furnitureRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import productionRoutes from "./routes/productionRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import { protect } from "./middleware/authMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Custom Furniture Production Tracker API",
    status: "Server is running",
  });
});

// Public login and one-time initial setup.
// Normal registration is protected inside authRoutes.
app.use("/api/auth", authRoutes);

// All business and user-management routes require authentication.
app.use("/api/users", protect, userRoutes);
app.use("/api/customers", protect, customerRoutes);
app.use("/api/furniture", protect, furnitureRoutes);
app.use("/api/materials", protect, materialRoutes);
app.use("/api/orders", protect, orderRoutes);
app.use("/api/payments", protect, paymentRoutes);
app.use("/api/production", protect, productionRoutes);
app.use("/api/deliveries", protect, deliveryRoutes);

app.use("/api/protected", protect, (req, res) => {
  res.status(200).json({
    message: "This is a protected route",
  });
});

export default app;
