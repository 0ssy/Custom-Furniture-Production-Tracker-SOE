
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
    },

    email: {
      type: String,
      required: [true, "Customer email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Customer phone number is required"],
      trim: true,
    },

    address: {
      type: String,
      required: [true, "Customer address is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// the Customer model created and exported
const Customer = mongoose.model<ICustomer>("Customer", customerSchema);

export default Customer;
