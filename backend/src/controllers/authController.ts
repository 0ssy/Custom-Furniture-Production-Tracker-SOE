
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { USER_ROLES, UserRole } from "../models/User.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

// Create the first Administrator only.
// Requires INITIAL_ADMIN_SETUP_KEY in the environment.
export const bootstrapAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const { fullName, email, password, setupKey } = req.body;

    const initialKey = process.env.INITIAL_ADMIN_SETUP_KEY;

    if (!initialKey || setupKey !== initialKey) {
      return res.status(403).json({
        message: "Invalid administrator setup key",
      });
    }

    if (
      !fullName ||
      !email ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        message:
          "Full name, email and a password of at least 8 characters are required",
      });
    }

    // Ensure MongoDB indexes are initialized before checking.
    await User.init();

    if (await User.exists({})) {
      return res.status(403).json({
        message: "Initial administrator has already been created",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName: String(fullName).trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "Administrator",
      isInitialAdmin: true,
    });

    return res.status(201).json({
      message: "Initial Administrator created successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "An initial Administrator or account with this email already exists",
      });
    }

    return res.status(500).json({
      message: "Error creating initial Administrator",
    });
  }
};

// Only authenticated Administrators can register accounts.
export const registerUser = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Full name, email and password are required",
      });
    }

    if (
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    if (!USER_ROLES.includes(role as UserRole)) {
      return res.status(400).json({
        message: "A valid user role is required",
        allowedRoles: USER_ROLES,
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName: String(fullName).trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    return res.status(500).json({
      message: "Error registering user",
    });
  }
};

// Login user.
export const loginUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    if (typeof password !== "string") {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      return res.status(500).json({
        message: "Server authentication configuration error",
      });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    return res.status(500).json({
      message: "Error logging in",
    });
  }
};
