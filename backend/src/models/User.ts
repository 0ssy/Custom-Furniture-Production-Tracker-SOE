
import mongoose, { Schema, Document } from "mongoose";

export const USER_ROLES = [
  "Administrator",
  "Manager",
  "Sales",
  "Production",
  "Delivery",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  isInitialAdmin?: boolean;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "Sales",
      required: true,
    },
    isInitialAdmin: {
      type: Boolean,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Guarantees only one account can be the initial administrator.
userSchema.index(
  { isInitialAdmin: 1 },
  {
    unique: true,
    sparse: true,
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
