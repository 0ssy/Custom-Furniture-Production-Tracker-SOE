import type { Request, Response } from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";

// Create a new order
export const createOrder = async (
    req: Request,
    res: Response,
    ): Promise<void> => {
    try {
        const { customer, items, expectedDeliveryDate } = req.body;

        // Check required information
        if (
        !customer ||
        !mongoose.isValidObjectId(customer) ||
        !Array.isArray(items) ||
        items.length === 0 ||
        !expectedDeliveryDate
        ) {
        res.status(400).json({
            message: "Valid customer, order items and delivery date are required",
        });
        return;
        }

        // Calculate the order total on the backend
        let totalAmount = 0;

        for (const item of items) {
        if (
            !item ||
            !mongoose.isValidObjectId(item.furniture) ||
            !Number.isInteger(item.quantity) ||
            item.quantity < 1 ||
            typeof item.unitPrice !== "number" ||
            !Number.isFinite(item.unitPrice) ||
            item.unitPrice < 0
        ) {
            res.status(400).json({
            message:
                "Each order item must have valid furniture, quantity and unit price",
            });
            return;
        }

        totalAmount += item.quantity * item.unitPrice;
        }

        // Create the order
        const order = await Order.create({
        customer,
        items,
        totalAmount,
        expectedDeliveryDate,
        });

        res.status(201).json({
        message: "Order created successfully",
        order,
        });
    } catch (error) {
        console.error("Error creating order:", error);

        res.status(400).json({
        message: "Could not create order",
        error: error instanceof Error ? error.message : "Unknown error",
        });
    }
    };

    // Get all orders
    export const getAllOrders = async (
    req: Request,
    res: Response,
    ): Promise<void> => {
    try {
        const orders = await Order.find()
        .populate("customer")
        .populate("items.furniture");

        res.status(200).json({
        count: orders.length,
        orders,
        });
    } catch (error) {
        console.error("Error fetching orders:", error);

        res.status(500).json({
        message: "Could not retrieve orders",
        });
    }
    };

    // Get one order by ID
    export const getOrderById = async (
    req: Request,
    res: Response,
    ): Promise<void> => {
    try {
        const order = await Order.findById(req.params.id)
        .populate("customer")
        .populate("items.furniture");

        if (!order) {
        res.status(404).json({
            message: "Order not found",
        });
        return;
        }

        res.status(200).json({ order });
    } catch (error) {
        console.error("Error fetching order:", error);

        res.status(400).json({
        message: "Invalid order ID",
        });
    }
    };

    // Update an order
    export const updateOrder = async (
    req: Request,
    res: Response,
    ): Promise<void> => {
    try {
        const updates = { ...req.body };

        // Do not allow clients to set the order total directly
        delete updates.totalAmount;

        // Prevent changing the order's creation date
        delete updates.orderDate;

        // Recalculate the total if order items are changed
        if (updates.items !== undefined) {
        if (!Array.isArray(updates.items) || updates.items.length === 0) {
            res.status(400).json({
            message: "An order must contain at least one item",
            });
            return;
        }

        let totalAmount = 0;

        for (const item of updates.items) {
            if (
            !item ||
            !mongoose.isValidObjectId(item.furniture) ||
            !Number.isInteger(item.quantity) ||
            item.quantity < 1 ||
            typeof item.unitPrice !== "number" ||
            !Number.isFinite(item.unitPrice) ||
            item.unitPrice < 0
            ) {
            res.status(400).json({
                message:
                "Each order item must have valid furniture, quantity and unit price",
            });
            return;
            }

            totalAmount += item.quantity * item.unitPrice;
        }

        updates.totalAmount = totalAmount;
        }

        const order = await Order.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
        })
        .populate("customer")
        .populate("items.furniture");

        if (!order) {
        res.status(404).json({
            message: "Order not found",
        });
        return;
        }

        res.status(200).json({
        message: "Order updated successfully",
        order,
        });
    } catch (error) {
        console.error("Error updating order:", error);

        res.status(400).json({
        message: "Could not update order",
        error: error instanceof Error ? error.message : "Unknown error",
        });
    }
    };

    // Delete an order
    export const deleteOrder = async (
    req: Request,
    res: Response,
    ): Promise<void> => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
        res.status(404).json({
            message: "Order not found",
        });
        return;
        }

        res.status(200).json({
        message: "Order deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting order:", error);

        res.status(400).json({
        message: "Invalid order ID",
        });
    }
    };
