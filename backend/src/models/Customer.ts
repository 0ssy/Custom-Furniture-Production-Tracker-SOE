import mongoose, { Schema, Document } from "mongoose";

// Define the structure of a Customer
export interface ICustomer extends Document {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

// Create the Customer schema
const customerSchema = new Schema<ICustomer>(
  {
    fullName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      minlength: [2, "Customer name must be at least 2 characters"],
    },

    email: {
      type: String,
      required: [true, "Customer email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    phone: {
      type: String,
      required: [true, "Customer phone number is required"],
      trim: true,
      minlength: [7, "Phone number must be at least 7 characters"],
    },

    address: {
      type: String,
      required: [true, "Customer address is required"],
      trim: true,
      minlength: [3, "Customer address must be at least 3 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the Customer model
const Customer = mongoose.model<ICustomer>("Customer", customerSchema);

export default Customer;