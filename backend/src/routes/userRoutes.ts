
import { Router } from "express";
import { authorize } from "../middleware/authMiddleware.js";

import {
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/userController.js";

const router = Router();

router.use(authorize("Administrator"));

router.get("/", getAllUsers);
router.put("/:id/role", updateUserRole);
router.delete("/:id", deleteUser);

export default router;
