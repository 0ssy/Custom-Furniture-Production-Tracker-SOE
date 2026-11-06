    import mongoose, { Schema, Document } from "mongoose";

    export type OrderStatus =
    | "Pending"
    | "Confirmed"
    | "In Production"
    | "Completed"
    | "Delivered"
    | "Cancelled";

    // Define the structure of an Order
    export interface IOrder extends Document {
    customer: mongoose.Types.ObjectId;
    items: {
        furniture: mongoose.Types.ObjectId;
        quantity: number;
        unitPrice: number;
    }[];
    totalAmount: number;
    orderStatus: OrderStatus;
    orderDate: Date;
    expectedDeliveryDate: Date;
    }

    // Define the structure of individual order items
    const orderItemSchema = new Schema(
    {
        furniture: {
        type: Schema.Types.ObjectId,
        ref: "Furniture",
        required: [true, "Furniture reference is required"],
        },

        quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [1, "Quantity must be at least 1"],
        validate: {
            validator: Number.isInteger,
            message: "Quantity must be a whole number",
        },
        },

        unitPrice: {
        type: Number,
        required: [true, "Unit price is required"],
        min: [0, "Unit price cannot be negative"],
        },
    },
    { _id: false }
    );

    // Create the Order schema
    const orderSchema = new Schema<IOrder>(
    {
        customer: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: [true, "Customer reference is required"],
        },

        items: {
        type: [orderItemSchema],
        required: true,
        validate: {
            validator: (items: unknown[]) => items.length > 0,
            message: "An order must contain at least one furniture item",
        },
        },

        totalAmount: {
        type: Number,
        required: [true, "Total amount is required"],
        min: [0, "Total amount cannot be negative"],
        },

        orderStatus: {
        type: String,
        enum: [
            "Pending",
            "Confirmed",
            "In Production",
            "Completed",
            "Delivered",
            "Cancelled",
        ],
        default: "Pending",
        },

        orderDate: {
        type: Date,
        default: Date.now,
        },

expectedDeliveryDate: {
  type: Date,
  required: [true, "Expected delivery date is required"],
},
    },
    {
        timestamps: true,
    }
    );

    // Create and export the Order model
    const Order = mongoose.model<IOrder>("Order", orderSchema);

    export default Order;