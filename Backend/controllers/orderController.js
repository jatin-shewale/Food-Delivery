import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";


const stript = new Stripe(process.env.STRIPE_SECRET_KEY);

//Placing user order for frontend:

const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";
const placeOrder = async (req, res) => {
  try {

    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Fee" },
        unit_amount: 200, 
      },
      quantity: 1,
    });

    const session = await stript.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });
    res.json({ success: true, session_url: session.url });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Internal Server Error" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if(success === true) {
      await orderModel.findByIdAndUpdate(orderId, { placeOrder: true });
      res.json({ success: true, message: "Payment succesfull" });
    }
    else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: true, message: "Payment canceled" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Internal Server Error" });
  }
}

//User order for frontend:
const userOrder = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data : orders });
  } catch (error) {
    console.log(error);
    res.json({success : false, message : "Error"});
  }
}

//Listing orders for admin pannel:

const listOrders = async (req, res) => {
try {
  const  orders = await orderModel.find({});
  res.json({ success: true, data: orders });
} catch (error) {
  console.log(error);
  res.json({ success: false, message: "Error" });
}
}

export { placeOrder, verifyOrder, userOrder, listOrders };
