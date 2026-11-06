
import mongoose, { Schema, Document } from "mongoose";

// Define the structure of a Material
export interface IMaterial extends Document {
  name: string;
  description: string;
  category: string;
  unit: string;
  quantityInStock: number;
  unitCost: number;
  reorderLevel: number;
}

// Create the Material schema
const materialSchema = new Schema<IMaterial>(
  {
    name: {
      type: String,
      required: [true, "Material name is required"],
      trim: true,
      minlength: [2, "Material name must be at least 2 characters"],
    },

    description: {
      type: String,
      required: [true, "Material description is required"],
      trim: true,
      minlength: [3, "Description must be at least 3 characters"],
    },

    category: {
      type: String,
      required: [true, "Material category is required"],
      enum: ["Timber", "Hardware", "Fabric", "Finishing", "Other"],
    },

    unit: {
      type: String,
      required: [true, "Material unit is required"],
      enum: ["Pieces", "Metres", "Sheets", "Litres", "Kilograms"],
    },

    quantityInStock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock quantity cannot be negative"],
      default: 0,
    },

    unitCost: {
      type: Number,
      required: [true, "Material unit cost is required"],
      min: [0, "Unit cost cannot be negative"],
    },

    reorderLevel: {
      type: Number,
      required: [true, "Reorder level is required"],
      min: [0, "Reorder level cannot be negative"],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the Material model
const Material = mongoose.model<IMaterial>(
  "Material",
  materialSchema
);

export default Material;
