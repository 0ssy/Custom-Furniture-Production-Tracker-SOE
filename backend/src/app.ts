import express from "express";
import cors from "cors";
import customerRoutes from "./routes/customerRoutes.js";
import furnitureRoutes from "./routes/furnitureRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import productionRoutes from "./routes/productionRoutes.js";

const app = express(); 

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to the Custom Furniture Production Tracker API",
        status: "Server is running",
    });
});

// Routes
app.use("/api/customers", customerRoutes);
app.use("/api/furniture", furnitureRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/production", productionRoutes);
export default app;

//using express() creates our express app
//using cors() allows the frontend to communicate with the backend from another origin
//express.json() allows express to read JSON data sent in Requests
//app.get("/")  Creates our homepage API endpoint
//res.status(200) indicatess a successfull request
//res.json() sends a JSON response to the client