
import { Request, Response } from "express";
import mongoose from "mongoose";
import User, { USER_ROLES, UserRole } from "../models/User.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

// List all users without exposing password hashes.
export const getAllUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await User.find()
      .select("-password -isInitialAdmin")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: users.length,
      users,
    });
  } catch {
    return res.status(500).json({
      message: "Could not retrieve users",
    });
  }
};

// Update a user's role.
export const updateUserRole = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const { role } = req.body;

    if (!USER_ROLES.includes(role as UserRole)) {
      return res.status(400).json({
        message: "Invalid role",
        allowedRoles: USER_ROLES,
      });
    }

    const user = await User.findById(id).select("+isInitialAdmin");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Prevent an Administrator from removing their own access.
    if (
      id === req.user?.id &&
      role !== "Administrator"
    ) {
      return res.status(400).json({
        message: "You cannot remove your own Administrator role",
      });
    }

    if (
  user.isInitialAdmin &&
  role !== "Administrator"
) {
  return res.status(403).json({
    message: "The initial Administrator cannot be demoted",
  });
}
    user.role = role;
    await user.save();

    return res.status(200).json({
      message: "User role updated successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    return res.status(500).json({
      message: "Could not update user role",
    });
  }
};

// Delete a user.
export const deleteUser = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    if (id === req.user?.id) {
      return res.status(400).json({
        message: "You cannot delete your own account",
      });
    }

    const user = await User.findById(id).select("+isInitialAdmin");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isInitialAdmin) {
      return res.status(403).json({
        message: "The initial Administrator account cannot be deleted",
      });
    }

    await user.deleteOne();

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch {
    return res.status(500).json({
      message: "Could not delete user",
    });
  }
};
