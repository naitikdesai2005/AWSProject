import express from "express"
import { loginUser,registerAdmin,registerUser,allitem, logout,search,createContactUs,sendEmail,getAllContacts, forgotPassword, verifyCodeAndResetPassword } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post("/registerUser",registerUser)
userRouter.post("/registerAdmin",registerAdmin)
userRouter.post("/login",loginUser)
userRouter.get("/getallitem",allitem)
userRouter.get("/logout",logout)
userRouter.post("/searchBakery",search)
userRouter.post("/forgotPassword",forgotPassword)
userRouter.post("/resetPassword",verifyCodeAndResetPassword)
userRouter.post("/createContactus",createContactUs)
userRouter.get('/contactus', getAllContacts);
userRouter.post('/send-email', sendEmail);

export default userRouter;