import { createContext, useEffect, useState } from "react";
import axios from "axios";
// import { food_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "https://food-delivery-p4wm.onrender.com"

  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  const addToCart = async (itemId) => {
    try {
      if (!itemId) {
        console.error('Invalid itemId provided to addToCart');
        return;
      }

      setCartItems((prev) => {
        const currentCount = prev?.[itemId] || 0;
        return {
          ...prev,
          [itemId]: currentCount + 1
        };
      });

      if (token) {
        await axios.post(url + "/api/cart/add", 
          { itemId }, 
          { headers: { Authorization: `Bearer ${token}` }}
        );
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      // Revert the cart state if the API call fails
      setCartItems((prev) => {
        const currentCount = prev?.[itemId] || 0;
        return {
          ...prev,
          [itemId]: Math.max(0, currentCount - 1)
        };
      });
    }
  };
  
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1}));
    if(token) {
      await axios.post(url + "/api/cart/remove", 
        { itemId }, 
        { headers: { Authorization: `Bearer ${token}` }}
      );
    }
  };
   

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    const response = await axios.get(url+"/api/food/list");
    setFoodList(response.data.data);
  }

  const loadCartData = async (token) => {
    const response = await axios.post(
      url + "/api/cart/get", 
      {}, 
      { headers: { Authorization: `Bearer ${token}` }}
    );
    setCartItems(response.data.cartData);
  }

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const storedToken = localStorage.getItem("token");
      if(storedToken) {
        // Clean the token by removing any whitespace or special characters
        const cleanToken = storedToken.trim();
        setToken(cleanToken);
        await loadCartData(cleanToken);
      }
    }
    loadData();
  },[])

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    loadCartData
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
