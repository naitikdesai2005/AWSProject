import express from "express";
import authMiddleware from "../middleware/auth.js";
import { addToCart, getCart, removeFromCart,deleteItemFromCart } from "../controllers/cartController.js";

const cartRouter = express.Router();

cartRouter.post("/addCart", authMiddleware, addToCart);
cartRouter.post("/removeCart", authMiddleware, removeFromCart);
cartRouter.get("/getCart", authMiddleware, getCart);
cartRouter.post("/deleteItem", deleteItemFromCart);
//cartRouter.post("/getCart", authMiddleware, getCart);

export default cartRouter;