import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
export const StoreContext = createContext(null);
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    try {
      return savedCart ? JSON.parse(savedCart) : {};
    } catch (error) {
      console.error("Error parsing cartItems from localStorage", error);
      return {};
    }
  });

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  const [food_list, setFoodList] = useState([]);
  const navigate = useNavigate();
  const url = "http://localhost:3000";

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const fetchFoodList = async () => {
    const response = await axios.get(`${url}/api/user/getallitem`);
    setFoodList(response.data.data);
  };

  const loadCartData = async (token) => {
    const decode = jwtDecode(token);
    const u_id = decode.id;

    const savedCart = localStorage.getItem(`cartItems_${u_id}`);
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
      [];
    } else {
      try {
        const response = await axios.post(
          `http://localhost:3000/api/cart/getCart`,
          { userId: u_id },
          { headers: { token } }
        );
        setCartItems(response.data.cartData);
      } catch (error) {
        console.error("Error loading cart data:", error);
      }
    }
  };

  const addToCart = async (itemId) => {
    const decode = jwtDecode(token);
    const u_id = decode.id;

    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    try {
      await axios.post(
       `${url}/api/cart/addCart`,
        { itemId, userId: u_id },
        { headers: { token } }
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (itemId) => {
    const decode = jwtDecode(token);
    const u_id = decode.id;

    if (cartItems[itemId] > 1) {
      setCartItems((prev) => ({
        ...prev,
        [itemId]: prev[itemId] - 1,
      }));

      try {
        await axios.post(
          `${url}/api/cart/removeCart`,
          { itemId, userId: u_id },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }
    } else {
      deleteFromCart(itemId);
      try {
        await axios.post(
          `${url}/api/cart/deleteItem`,
          { itemId, userId: u_id },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Error deleting item from cart:", error);
      }
    }
  };

  const deleteFromCart = async (itemId) => {
    const decode = jwtDecode(token);
    const u_id = decode.id;

    setCartItems((prev) => {
      const newCart = { ...prev };
      delete newCart[itemId];
      return newCart;
    });

    try {
      await axios.post(
        `${url}/api/cart/deleteItem`,
        { itemId, userId: u_id },
        { headers: { token } }
      );
    } catch (error) {
      console.error("Error deleting item from cart:", error);
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      try {
        if (cartItems[item] > 0) {
          let itemInfo = food_list.find((product) => product._id === item);
          totalAmount += itemInfo.price * cartItems[item];
        }
      } catch (error) {}
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItems = 0;
    for (const item in cartItems) {
      totalItems += cartItems[item];
    }
    return totalItems;
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();

      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        setIsAuthenticated(true);
        await loadCartData(storedToken);
      }
    }
    loadData();
  }, []);

  const logout = () => {
    if (token) {
      const decode = jwtDecode(token);
      const u_id = decode.id;
      localStorage.setItem(`cartItems_${u_id}`, JSON.stringify(cartItems));
    }
    setToken("");
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    setCartItems({});
    navigate("/");
  };

  const clearCart = () => {
    setCartItems({});
  };

  const contextValue = {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    deleteFromCart,
    getTotalCartAmount,
    getTotalCartItems,
    token,
    clearCart,
    setToken,
    isAuthenticated,
    setIsAuthenticated,
    logout,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;