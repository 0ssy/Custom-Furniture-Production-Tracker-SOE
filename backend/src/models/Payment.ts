    import mongoose, { Schema, Document } from "mongoose";

    export interface IPayment extends Document {
    order: mongoose.Types.ObjectId;
    amount: number;
    paymentMethod: string;
    paymentStatus: string;
    paymentDate: Date;
    transactionReference?: string;
    }

    const paymentSchema = new Schema<IPayment>(
    {
        order: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: [true, "Order reference is required"],
        },
        amount: {
        type: Number,
        required: [true, "Payment amount is required"],
        min: [0.01, "Payment amount must be greater than zero"],
        },
        paymentMethod: {
        type: String,
        enum: ["Cash", "Bank Transfer", "Card", "Mobile Money"],
        required: [true, "Payment method is required"],
        },
        paymentStatus: {
        type: String,
        enum: ["Pending", "Completed", "Failed", "Refunded"],
        default: "Pending",
        },
        paymentDate: {
        type: Date,
        default: Date.now,
        },
        transactionReference: {
        type: String,
        trim: true,
        },
    },
    { timestamps: true }
    );

    const Payment = mongoose.model<IPayment>("Payment", paymentSchema);

    export default Payment;