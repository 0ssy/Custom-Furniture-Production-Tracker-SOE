import express from "express";
import cors from "cors";

const app = express(); 

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to the Custom Furniture Production Tracker API",
        status: "Server is running",
    });
});

export default app;

//using express() creates our express app
//using cors() allows the frontend to communicate with the backend from another origin
//express.json() allows express to read JSON data sent in Requests
//app.get("/")  Creates our homepage API endpoint
//res.status(200) indicatess a successfull request
//res.json() sends a JSON response to the client