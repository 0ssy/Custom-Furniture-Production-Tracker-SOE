
import mongoose, { Schema, Document } from "mongoose";

export type DeliveryStatus =
  | "Pending"
  | "In Transit"
  | "Delivered"
  | "Failed";

export interface IDelivery extends Document {
  order: mongoose.Types.ObjectId;
  deliveryAddress: string;
  deliveryDate: Date;
  deliveryStatus: DeliveryStatus;
  notes?: string;
}

const deliverySchema = new Schema<IDelivery>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order reference is required"],
    },
    deliveryAddress: {
      type: String,
      required: [true, "Delivery address is required"],
      trim: true,
    },
    deliveryDate: {
      type: Date,
      required: [true, "Delivery date is required"],
    },
    deliveryStatus: {
      type: String,
      enum: ["Pending", "In Transit", "Delivered", "Failed"],
      default: "Pending",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Delivery = mongoose.model<IDelivery>("Delivery", deliverySchema);

export default Delivery;
