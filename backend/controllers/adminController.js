import bakerModel from "../models/bakerModel.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

const bakerData = async (req, res) => {
  try {
    const bakersData = await bakerModel.find();

    if (!bakersData) {
      return res
        .status(404)
        .json({ status: false, message: "Bakers data not found" });
    }

    console.log(bakersData);

    return res.status(200).json({
      status: true,
      data: bakersData
    })

  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};


const userData = async (req, res) => {
  try {
    const usersData = await userModel.find().lean(); // Using lean() to improve performance if you don't need full mongoose objects
    const usersWithOrders = await Promise.all(
      usersData.map(async (user) => {
        const orderCount = await orderModel.countDocuments({ userId: user._id });
        return { ...user, orderCount }; // Add orderCount to each user object
      })
    );

    if (!usersWithOrders.length) {
      return res.status(404).json({ status: false, message: "Users data not found" });
    }

    console.log(usersWithOrders);
    return res.status(200).json({ status: true, data: usersWithOrders });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};



const orderData = async (req, res) => {
  try {
    const ordersData = await orderModel.find();

    if (!ordersData) {
      return res
        .status(404)
        .json({ status: false, message: "Orders data not found" });
    }

    console.log(ordersData);

    return res.status(200).json({
      status: true,
      data: ordersData
    })

  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const dashboardData = async (req, res) => {
  try {
    const totalBakers = await bakerModel.countDocuments(); // Get total bakers
    const totalUsers = await userModel.countDocuments(); // Get total users
    const totalOrders = await orderModel.countDocuments(); // Get total orders
    const totalItems = await productModel.countDocuments(); // Get total items

    if (
      totalBakers === null ||
      totalUsers === null ||
      totalOrders === null ||
      totalItems === null
    ) {
      return res
        .status(404)
        .json({ status: false, message: "Dashboard data not found" });
    }

    return res.status(200).json({
      status: true,
      data: { totalBakers, totalUsers, totalOrders, totalItems },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching dashboard data",
    });
  }
};


export { bakerData, userData, orderData, dashboardData };
