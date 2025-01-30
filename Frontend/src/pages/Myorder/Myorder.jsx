import React, { useEffect, useContext, useState } from 'react';
import './Myorder.css';
import { StoreContext } from '../../context/StoreContext.jsx';
import axios from 'axios';
import { assets } from '../../assets/assets.js';

const Myorder = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  
  // Function to fetch user orders
  const fetchOrder = async () => {
    try {
      const response = await axios.post(
        `${url}/api/order/userorder`,
        {},
        { headers: { token } }
      );
      setData(response.data.data); // Set the fetched orders
    } catch (error) {
      console.error('Error fetching orders', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrder();
    }
  }, [token]); 

  const handleNewOrder = () => {
    fetchOrder(); 
  };

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.length === 0 ? (
          <p>No orders yet. Place an order to see it here!</p>
        ) : (
          data.map((order, index) => {
            return (
              <div key={index} className="my-orders-order">
                <img src={assets.parcel_icon} alt="" />
                <p>
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return item.name + " x " + item.quantity;
                    } else {
                      return item.name + " x " + item.quantity + ", ";
                    }
                  })}
                </p>
                <p>${order.amount}.00</p>
                <p>Items: {order.items.length}</p>
                <p>
                  <span>&#x25cf;</span> <b>{order.status}</b>
                </p>
                <button>Track Order</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Myorder;
