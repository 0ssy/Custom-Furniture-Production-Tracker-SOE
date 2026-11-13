
import { Router } from "express";
import {
  bootstrapAdmin,
  registerUser,
  loginUser,
} from "../controllers/authController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/bootstrap", bootstrapAdmin);

router.post(
  "/register",
  protect,
  authorize("Administrator"),
  registerUser
);

router.post("/login", loginUser);

export default router;
