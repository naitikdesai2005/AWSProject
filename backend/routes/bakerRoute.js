import express from "express"
import { loginUser, registerBaker, bakerProfile, updateBakerProfile } from "../controllers/userController.js"
import authMiddleware from "../middleware/auth.js";
import multer from 'multer';

const bakerRouter = express.Router()

const storage = multer.diskStorage({
  destination: 'profileImages',
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  }
})

const upload = multer({ storage: storage })

bakerRouter.post("/registerBaker", registerBaker)
// bakerRouter.post("/login",loginUser)
bakerRouter.get("/profile", authMiddleware, bakerProfile);
bakerRouter.post("/updateProfile", upload.single('image'), authMiddleware, updateBakerProfile)

export default bakerRouter;