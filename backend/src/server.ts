
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

// Load the environment variables from the project root
dotenv.config({ path: "../.env" });

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Start Express only after MongoDB connects
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
