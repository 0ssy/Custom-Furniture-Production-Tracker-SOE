
import mongoose, { Schema, Document } from "mongoose";

export type ProductionStatus =
  | "Not Started"
  | "In Progress"
  | "Completed"
  | "On Hold";

export interface IProduction extends Document {
  order: mongoose.Types.ObjectId;
  productionStatus: ProductionStatus;
  startDate?: Date;
  completionDate?: Date;
  notes?: string;
}

const productionSchema = new Schema<IProduction>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order reference is required"],
    },
    productionStatus: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed", "On Hold"],
      default: "Not Started",
    },
    startDate: {
      type: Date,
    },
    completionDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Production = mongoose.model<IProduction>(
  "Production",
  productionSchema
);

export default Production;
