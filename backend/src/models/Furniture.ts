
import mongoose, { Schema, Document } from "mongoose";

// Define the structure of a Furniture item
export interface IFurniture extends Document {
  name: string;
  description: string;
  category: string;
  basePrice: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  isAvailable: boolean;
}

// Create the Furniture schema
const furnitureSchema = new Schema<IFurniture>(
  {
    name: {
      type: String,
      required: [true, "Furniture name is required"],
      trim: true,
      minlength: [2, "Furniture name must be at least 2 characters"],
    },

    description: {
      type: String,
      required: [true, "Furniture description is required"],
      trim: true,
      minlength: [3, "Description must be at least 3 characters"],
    },

    category: {
      type: String,
      required: [true, "Furniture category is required"],
      enum: ["Chair", "Table", "Bed", "Sofa", "Cabinet", "Other"],
    },

    basePrice: {
      type: Number,
      required: [true, "Base price is required"],
      min: [0, "Price cannot be negative"],
    },

    dimensions: {
      length: {
        type: Number,
        required: [true, "Length is required"],
        min: [0.01, "Length must be greater than zero"],
      },
      width: {
        type: Number,
        required: [true, "Width is required"],
        min: [0.01, "Width must be greater than zero"],
      },
      height: {
        type: Number,
        required: [true, "Height is required"],
        min: [0.01, "Height must be greater than zero"],
      },
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the Furniture model
const Furniture = mongoose.model<IFurniture>(
  "Furniture",
  furnitureSchema
);

export default Furniture;
