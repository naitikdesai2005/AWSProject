import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import { createOrder } from "./orderController.js";

// Create order from cart
const checkout = async (req, res) => {
  try {
    await createOrder(req, res);
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error during checkout" });
  }
};

// Add items to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    if (!userId || !itemId) {
      return res.json({ success: false, message: "Missing userId or itemId" });
    }

    let userData = await userModel.findById(userId);

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {}; // Ensure cartData is initialized

    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error adding to cart" });
  }
};


const getCart = async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if userId is provided
    if (!userId) {
      return res.json({ success: false, message: "Missing userId" });
    }

    let userData = await userModel.findById(userId);
    if (!userData || !userData.cartData || typeof userData.cartData !== 'object') {
      return res.json({ success: false, message: "No cart data found" });
    }

    // Convert cartData object to array (assuming each key is a productId)
    const cartArray = Object.keys(userData.cartData).map(productId => ({
      productId, 
      quantity: userData.cartData[productId] 
    }));

    // Extract product IDs from the cart array
    const productIds = cartArray.map(item => item.productId);

    // Fetch product information (name, description, price, image) for each productId
    const products = await productModel.find({ _id: { $in: productIds } }, 'name description price image');

    // Combine cart data with product information and user-specific quantity
    const enrichedCartData = cartArray.map(item => {
      const product = products.find(p => p._id.toString() === item.productId);
      return {
        productId: item.productId,
        name: product ? product.name : 'Unknown Product',
        description: product ? product.description : 'No description available',
        price: product ? product.price : 0,
        image: product ? product.image : '',
        quantity: item.quantity 
      };
    });

    res.json({ success: true, cartData: enrichedCartData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error retrieving cart" });
  }
};



// Remove items from the user cart
const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    if (!userId || !itemId) {
      return res.json({ success: false, message: "Missing userId or itemId" });
    }

    let userData = await userModel.findById(userId);

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {}; // Ensure cartData is initialized

    if (cartData[itemId] > 0) {
      cartData[itemId] -= 1;

      if (cartData[itemId] === 0) {
        delete cartData[itemId]; // Remove item from cart if quantity is zero
      }

      await userModel.findByIdAndUpdate(userId, { cartData });
      return res.json({ success: true, message: "Removed From Cart" });
    } else {
      return res.json({ success: false, message: "Item not in cart" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error removing from cart" });
  }
};

// Delete item from the user cart completely
const deleteItemFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    if (!userId || !itemId) {
      return res.json({ success: false, message: "Missing userId or itemId" });
    }

    let userData = await userModel.findById(userId);

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {}; // Ensure cartData is initialized

    if (cartData[itemId]) {
      delete cartData[itemId]; // Delete the item from the cart

      await userModel.findByIdAndUpdate(userId, { cartData });
      return res.json({ success: true, message: "Item deleted from cart" });
    } else {
      return res.json({ success: false, message: "Item not found in cart" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error deleting item from cart" });
  }
};

export { addToCart, getCart, removeFromCart, checkout, deleteItemFromCart };
