
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { USER_ROLES, UserRole } from "../models/User.js";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      return res.status(500).json({
        message: "Server authentication configuration error",
      });
    }

    if (!token) {
      return res.status(401).json({
        message: "Authentication token missing",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      role: UserRole;
    };

    if (!decoded.id || !USER_ROLES.includes(decoded.role)) {
      return res.status(401).json({
        message: "Invalid authentication token",
      });
    }

    // Always retrieve the current database role.
    const user = await User.findById(decoded.id).select("role");

    if (!user) {
      return res.status(401).json({
        message: "User account no longer exists",
      });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
    };

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    }

    next();
  };
};
