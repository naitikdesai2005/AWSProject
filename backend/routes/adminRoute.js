import express from "express"
import { bakerData, orderData, userData, dashboardData } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/bakersData", bakerData);
adminRouter.get("/usersData", userData);
adminRouter.get("/ordersData", orderData);
adminRouter.get("/dashdata", dashboardData);

export default adminRouter;


