import React from "react";
import "./Order.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const Order = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.status === 200) {
        setOrders(response.data.data);
        console.log(response.data);
      }
    } catch (error) {
      toast.error("Error fetching orders: " + error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
            <div key={index} className="order-item">
              <img src={assets.parcel_icon} alt="" />
              <div>
                <p className="order-item-fppd">
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return item.name + " x " + item.quantity;
                    } else {
                      return item.name + " x " + item.quantity + ", ";
                    }
                  })}
                </p>
                <p className="order-item-name">{order.address.firstName + " " + order.address.lastName}</p>
                <div className="order-item-address">
                  <p>{order.address.street + ","}</p>
                  <p>{order.address.street + ", " + order.address.state + ", " + order.address.country + ", " + order.address.pinCode}</p>
                </div>
                <p className="order-item phone">{order.address.phone}</p>
              </div>
              <p>Items : {order.items.length}</p>
              <p>Price : ${order.amount}</p>
              <select>
                <option value="Food Processing"></option>
                <option value="Out For Delivery"></option>
                <option value="Delivered"></option>
              </select>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Order;