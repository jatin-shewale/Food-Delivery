import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },

    items: {
        type: Array,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    address: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pinCode: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true }
    },

    status: {
        type: String,
        default: "Pending"
    },

    date: {
        type: Date,
        default: Date.now
    },

    payment: {
        type: Boolean,
        default: false
    }
});

const orderModel = mongoose.model.user || mongoose.model("order", orderSchema);

export default orderModel;
