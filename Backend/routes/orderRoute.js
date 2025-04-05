import express from "express";
import authMiddleware from "../middleware/auth.js";
import { listOrders, placeOrder, userOrder, verifyOrder, updateOrderStatus } from "../controllers/orderController.js";

const orderRouter = express.Router();

// Frontend routes (require user authentication)
orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", authMiddleware, verifyOrder);
orderRouter.post("/userorder", authMiddleware, userOrder);

// Admin routes - list orders without authentication
orderRouter.get("/list", listOrders);
orderRouter.post("/status", updateOrderStatus);

export default orderRouter;