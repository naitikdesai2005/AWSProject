import express from "express"
import { loginUser, registerBaker } from "../controllers/userController.js"
import { addItem, listItem, deleteItem } from "../controllers/productController.js"
import authMiddleware from "../middleware/auth.js"
import multer from 'multer'
const productRoute = express.Router();



const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
})

const upload = multer({ storage: storage })

productRoute.post("/add", upload.single('image'), authMiddleware, addItem);
productRoute.get("/bakerProduct", authMiddleware, listItem);
productRoute.post("/delete", authMiddleware, deleteItem);

export default productRoute;