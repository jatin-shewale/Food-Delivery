import React from "react";
import "./Order.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const Order = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${url}/api/order/list`);
      if (response.status === 200) {
        if (response.data && Array.isArray(response.data.data)) {
          const validOrders = response.data.data.filter(order => order && typeof order === 'object');
          setOrders(validOrders);
        } else {
          console.error('Invalid response structure:', response.data);
          setError("Invalid response format from server");
          toast.error("Invalid response format from server");
          setOrders([]);
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError("Error fetching orders: " + error.message);
      toast.error("Error fetching orders: " + error.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: newStatus
      });
      if (response.status === 200) {
        toast.success("Order status updated successfully");
        fetchAllOrders();
      }
    } catch (error) {
      toast.error("Error updating order status: " + error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  if (loading) {
    return (
      <div className="order">
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="order">
      <h3>Order Management</h3>
      <div className="order-list">
        {orders.length === 0 ? (
          <div className="no-orders">No orders found</div>
        ) : (
          orders.map((order, index) => {
            if (!order || typeof order !== 'object') return null;
            
            return (
              <div key={index} className="order-item">
                <img src={assets.parcel_icon} alt="Order Icon" />
                <div>
                  <p className="order-item-fppd">
                    {Array.isArray(order.items) && order.items.length > 0
                      ? order.items.map((item, idx) => {
                          if (!item || typeof item !== 'object') return null;
                          return idx === order.items.length - 1
                            ? `${item.name || 'Unknown Item'} x ${item.quantity || 1}`
                            : `${item.name || 'Unknown Item'} x ${item.quantity || 1}, `;
                        }).filter(Boolean).join('')
                      : "No items"}
                  </p>
                  <p className="order-item-name">
                    {order.address?.firstName || 'N/A'} {order.address?.lastName || ''}
                  </p>
                  <div className="order-item-address">
                    <p>
                      {[
                        order.address?.street,
                        order.address?.city,
                        order.address?.state,
                        order.address?.country,
                        order.address?.pinCode
                      ].filter(Boolean).join(', ') || 'No address provided'}
                    </p>
                  </div>
                  <p className="order-item phone">{order.address?.phone || 'No phone provided'}</p>
                </div>
                <p>Items: {Array.isArray(order.items) ? order.items.length : 0}</p>
                <p>${order.amount || 0}</p>
                <select 
                  value={order.status || "Food Processing"}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                >
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out For Delivery">Out For Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Order;