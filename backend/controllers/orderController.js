// // import bakerModel from "../models/bakerModel.js";
// // import orderModel from "../models/orderModel.js";
// // import productModel from "../models/productModel.js";
// // import userModel from "../models/userModel.js";
// // import Stripe from "stripe";

// // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // const createOrder = async (req, res) => {
// //   const frontend_URL = "http://localhost:5173";
// //   const deliveryCharge = 40;
// //   const currency = "inr";

// //   try {
// //     const user = await userModel.findById(req.body.userId);
// //     if (!user) {
// //       return res.json({ success: false, message: "User not found" });
// //     }

// //     const { firstname, lastname, email, address, phone } = req.body;
// //     const cartData = user.cartData;
// //     let items = [];
// //     let totalPrice = 0;
// //     let bakerItemsMap = {};

// //     for (let itemId in cartData) {
// //       const product = await productModel.findById(itemId);
// //       if (product) {
// //         const quantity = cartData[itemId];
// //         const itemPrice = product.price * quantity;
// //         items.push({
// //           productId: product._id,
// //           bakerId: product.bakerid,
// //           quantity,
// //           price: product.price,
// //         });
// //         totalPrice += itemPrice;

// //         if (!bakerItemsMap[product.bakerid]) {
// //           bakerItemsMap[product.bakerid] = [];
// //         }
// //         bakerItemsMap[product.bakerid].push({
// //           productId: product._id,
// //           quantity,
// //           price: product.price,
// //         });
// //       }
// //     }

// //     const newOrder = new orderModel({
// //       userId: user._id,
// //       firstname,
// //       lastname,
// //       email,
// //       address,
// //       phone,
// //       totalPrice: totalPrice + deliveryCharge,
// //       items,
// //     });
// //     const savedOrder = await newOrder.save();

// //     for (let bakerId in bakerItemsMap) {
// //       const baker = await bakerModel.findById(bakerId);
// //       if (baker) {
// //         baker.orders.push({
// //           orderId: savedOrder._id,
// //           items: bakerItemsMap[bakerId],
// //           status: "Pending",
// //         });
// //         await baker.save();
// //       }
// //     }

// //     user.cartData = {};
// //     await user.save();

// //     const line_items = items.map((item) => ({
// //       price_data: {
// //         currency: currency,
// //         product_data: {
// //           name: item.productId.toString(),
// //         },
// //         unit_amount: item.price * 100,
// //       },
// //       quantity: item.quantity,
// //     }));

// //     line_items.push({
// //       price_data: {
// //         currency: currency,
// //         product_data: {
// //           name: "Delivery Charge",
// //         },
// //         unit_amount: deliveryCharge * 100,
// //       },
// //       quantity: 1,
// //     });

// //     const session = await stripe.checkout.sessions.create({
// //       payment_method_types: ["card"],
// //       line_items,
// //       mode: "payment",
// //       success_url: `${frontend_URL}/verify?success=true&orderId=${savedOrder._id}`,
// //       cancel_url: `${frontend_URL}/verify?success=false&orderId=${savedOrder._id}`,
// //     });

// //     res.json({ success: true, session_url: session.url });
// //   } catch (error) {
// //     console.error(error);
// //     res.json({ success: false, message: "Error creating order" });
// //   }
// // };

// // const getBakerOrders = async (req, res) => {
// //   try {
// //     const orders = await orderModel.find({ bakerId: req.body.bakerId })
// //       .populate({
// //         path: 'items.productId',
// //         select: 'name price image',
// //       })

// //       .populate({
// //         path: 'userId',
// //         select: 'firstName lastName address phone',
// //       })

// //     res.json({ success: true, data: orders });
// //     // const bakerId = req.body.userId;

// //     // const baker = await bakerModel.findById(bakerId);
// //     // if (!baker) {
// //     //   return res.status(404).json({ success: false, message: "Baker not found" });
// //     // }

// //     // const formattedOrders = [];

// //     // for (const orderInfo of baker.orders) {
// //     //   // Find each order and populate both items and user details
// //     //   const order = await orderModel.findById(orderInfo.orderId)
// //     //     .populate('items.productId', 'name price image')
// //     //     .populate('userId', 'firstName lastName email phone address');

// //     //   if (!order) continue;

// //     //   const orderDetails = {
// //     //     user: {
// //     //       name: ${order.userId.firstName} ${order.userId.lastName},
// //     //       email: order.userId.email,
// //     //       phone: order.userId.phone,
// //     //       address: order.userId.address,
// //     //     },
// //     //     items: order.items.map(item => ({
// //     //       name: item.productId.name,
// //     //       quantity: item.quantity,
// //     //       price: item.productId.price,
// //     //       image: item.productId.image,
// //     //     })),
// //     //     totalPrice: order.totalPrice,
// //     //     status: order.status,
// //     //   };

// //     //   formattedOrders.push(orderDetails);
// //     // }

// //     // res.json({ success: true, data: formattedOrders });
// //   } catch (error) {
// //     console.log(error);
// //     res.status(500).json({ success: false, message: "Error retrieving orders" });
// //   }
// // };

// // const updateOrderStatus = async (req, res) => {
// //   console.log(req.body);
// //   try {
// //     await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
// //     res.json({ success: true, message: "Status Updated" })
// //   } catch (error) {
// //     res.json({ success: false, message: "Error" })
// //   }
// // }

// // const getUserOrders = async (req, res) => {
// //   try {
// //     const orders = await orderModel.find({ userId: req.body.userId }).populate({
// //       path: 'items.productId',
// //       select: 'name price image',
// //     });

// //     res.json({ success: true, data: orders });
// //   } catch (error) {
// //     console.log(error);
// //     res.json({ success: false, message: "Error retrieving orders" });
// //   }
// // };

// // const verifyOrder = async (req, res) => {
// //   const { orderId, success } = req.body;
// //   try {
// //     if (success === "true") {
// //       await orderModel.findByIdAndUpdate(orderId, { payment: true });
// //       res.json({ success: true, message: "Paid" })
// //     }
// //     else {
// //       await orderModel.findByIdAndDelete(orderId)
// //       res.json({ success: false, message: "Not Paid" })
// //     }
// //   } catch (error) {
// //     res.json({ success: false, message: "Not  Verified" })
// //   }
// // }

// // const updateOrder = async (req, res) => {
// //   const { orderId, items, cancel } = req.body; // Expecting items and cancel from the request body

// //   try {
// //     // Find the order by ID
// //     const order = await orderModel.findById(orderId);

// //     if (!order) {
// //       return res.status(404).json({ success: false, message: "Order not found" });
// //     }

// //     // Check if the order is cancelled
// //     if (order.canclelled) {
// //       return res.status(400).json({ success: false, message: "Order has already been cancelled" });
// //     }

// //     // If the user wants to cancel the order
// //     if (cancel) {
// //       order.canclelled = true; // Mark the order as cancelled

// //       // Update each baker's orders
// //       for (const item of order.items) {
// //         const bakerId = item.bakerId; // Get the baker ID for each item
// //         await bakerModel.updateOne(
// //           { _id: bakerId, 'orders.orderId': orderId },
// //           { $set: { 'orders.$.status': 'Cancelled' } }
// //         );
// //       }
// //     } else {
// //       // Update the order items
// //       order.items = order.items.map(item => {
// //         const updatedItem = items.find(i => i.productId.toString() === item.productId.toString());
// //         if (updatedItem) {
// //           item.quantity = updatedItem.quantity; // Update the quantity
// //         }
// //         return item;
// //       });

// //       // Update each baker's orders with the new quantities
// //       for (const item of order.items) {
// //         const bakerId = item.bakerId; // Get the baker ID for each item
// //         await bakerModel.updateOne(
// //           { _id: bakerId, 'orders.orderId': orderId, 'orders.items.productId': item.productId },
// //           { $set: { 'orders.$.items.$[elem].quantity': item.quantity } },
// //           { arrayFilters: [{ 'elem.productId': item.productId }] } // Update the specific item quantity
// //         );
// //       }
// //     }

// //     // Save the updated order
// //     await order.save();

// //     res.json({ success: true, order });
// //   } catch (error) {
// //     console.error("Error updating order:", error);
// //     res.status(500).json({ success: false, message: "Error updating order" });
// //   }
// // };

// // export { updateOrder, createOrder, updateOrderStatus, getBakerOrders, verifyOrder, getUserOrders };

// import bakerModel from "../models/bakerModel.js";
// import orderModel from "../models/orderModel.js";
// import productModel from "../models/productModel.js";
// import userModel from "../models/userModel.js";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const createOrder = async (req, res) => {
//   const frontend_URL = "http://localhost:5173";
//   const deliveryCharge = 40;
//   const currency = "inr";

//   try {
//     const user = await userModel.findById(req.body.userId);
//     if (!user) {
//       return res.json({ success: false, message: "User not found" });
//     }

//     const { firstname, lastname, email, address, phone } = req.body;
//     const cartData = user.cartData;
//     let items = [];
//     let totalPrice = 0;
//     let bakerItemsMap = {};

//     for (let itemId in cartData) {
//       const product = await productModel.findById(itemId);
//       if (product) {
//         const quantity = cartData[itemId];
//         const itemPrice = product.price * quantity;
//         items.push({
//           productId: product._id,
//           bakerId: product.bakerid,
//           quantity,
//           price: product.price,
//         });
//         totalPrice += itemPrice;

//         if (!bakerItemsMap[product.bakerid]) {
//           bakerItemsMap[product.bakerid] = [];
//         }
//         bakerItemsMap[product.bakerid].push({
//           productId: product._id,
//           quantity,
//           price: product.price,
//         });
//       }
//     }

//     const newOrder = new orderModel({
//       userId: user._id,
//       firstname,
//       lastname,
//       email,
//       address,
//       phone,
//       totalPrice: totalPrice + deliveryCharge,
//       items,
//     });
//     const savedOrder = await newOrder.save();

//     for (let bakerId in bakerItemsMap) {
//       const baker = await bakerModel.findById(bakerId);
//       if (baker) {
//         baker.orders.push({
//           orderId: savedOrder._id,
//           items: bakerItemsMap[bakerId],
//           status: "Pending",
//         });
//         await baker.save();
//       }
//     }

//     user.cartData = {};
//     await user.save();

//     const line_items = items.map((item) => ({
//       price_data: {
//         currency: currency,
//         product_data: {
//           name: item.productId.toString(),
//         },
//         unit_amount: item.price * 100,
//       },
//       quantity: item.quantity,
//     }));

//     line_items.push({
//       price_data: {
//         currency: currency,
//         product_data: {
//           name: "Delivery Charge",
//         },
//         unit_amount: deliveryCharge * 100,
//       },
//       quantity: 1,
//     });

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items,
//       mode: "payment",
//       success_url: `${frontend_URL}/verify?success=true&orderId=${savedOrder._id}`,
//       cancel_url: `${frontend_URL}/verify?success=false&orderId=${savedOrder._id}`,
//     });

//     res.json({ success: true, session_url: session.url });
//   } catch (error) {
//     console.error(error);
//     res.json({ success: false, message: "Error creating order" });
//   }
// };

// const getBakerOrders = async (req, res) => {
//   try {
//     const bakerId = req.body.userId;

//     const baker = await bakerModel.findById(bakerId);
//     if (!baker) {
//       return res.status(404).json({ success: false, message: "Baker not found" });
//     }

//     const formattedOrders = [];

//     for (const orderInfo of baker.orders) {
//       const order = await orderModel.findById(orderInfo.orderId).populate('userId', 'firstName lastName email phone address');

//       if (!order) continue;

//       const items = order.items.filter(item => item.bakerId.toString() === bakerId);

//       if (items.length === 0) continue;

//       let totalPrice = 0;
//       const formattedItems = await Promise.all(items.map(async item => {
//         const product = await productModel.findById(item.productId);
//         const itemTotalPrice = item.quantity * item.price;
//         totalPrice += itemTotalPrice;

//         return {
//           name: product.name,
//           quantity: item.quantity,
//           price: item.price,
//           image: product.image,
//           totalPrice: itemTotalPrice
//         };
//       }));

//       const orderDetails = {
//         user: {
//           name: `${order.firstname} ${order.lastname}`,
//           email: order.email,
//           phone: order.phone,
//           address: order.address,
//         },
//         items: formattedItems,
//         totalPrice: totalPrice,
//         status: order.status,
//       };

//       formattedOrders.push(orderDetails);
//     }

//     res.json({ success: true, data: formattedOrders });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: "Error retrieving orders" });
//   }
// };

// const updateOrderStatus = async (req, res) => {
//   console.log(req.body);
//   try {
// <<<<<<< Updated upstream
//     const { orderId, itemId, status } = req.body;

//     const order = await orderModel.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     const item = order.items.id(itemId);
//     if (!item) {
//       return res.status(404).json({ success: false, message: "Item not found" });
//     }

//     item.status = status;
//     await order.save();

//     // await checkOrderStatus(orderId);

//     res.json({ success: true, message: "Item status updated" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Error updating status" });
//   }
// };

// const checkOrderStatus = async (req,res) => {
//   const orderId = req.body.orderId;
//   console.log(orderId);
//   try {
//     const order = await orderModel.findById(orderId);
//     if (!order) {
//       throw new Error("Order not found");
//     }

//     const allDelivered = order.items.every(item => item.status === "Delivered");

//     if (allDelivered) {
//       order.status = "Delivered";
//       await order.save();
//       res.json({
//         success:"true"
//       });
//     }else{
//       res.json({
//         success:"false"
//       });
//     }

//   } catch (error) {
//     console.error("Error checking order status:", error);
//   }
// };

// =======
//     await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
//     res.json({ success: true, message: "Status Updated" })
//   } catch (error) {
//     res.json({ success: false, message: "Error" })
//   }
// }
// >>>>>>> Stashed changes

// const getUserOrders = async (req, res) => {
//   try {
//     const orders = await orderModel.find({ userId: req.body.userId }).populate({
//       path: 'items.productId',
//       select: 'name price image',
//     });

//     res.json({ success: true, data: orders });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error retrieving orders" });
//   }
// };

// const verifyOrder = async (req, res) => {
//   const { orderId, success } = req.body;
//   try {
//     if (success === "true") {
//       await orderModel.findByIdAndUpdate(orderId, { payment: true });
//       res.json({ success: true, message: "Paid" })
//     }
//     else {
//       await orderModel.findByIdAndDelete(orderId)
//       res.json({ success: false, message: "Not Paid" })
//     }
//   } catch (error) {
//     res.json({ success: false, message: "Not Verified" })
//   }
// }

// const updateOrder = async (req, res) => {
//   const { orderId, items, cancel } = req.body;

//   try {
//     const order = await orderModel.findById(orderId);

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     if (order.cancelled) {
//       return res.status(400).json({ success: false, message: "Order has already been cancelled" });
//     }

//     if (cancel) {
//       order.cancelled = true;
//       order.status = "Cancelled";

//       for (const item of order.items) {
//         const bakerId = item.bakerId;
//         await bakerModel.updateOne(
//           { _id: bakerId, 'orders.orderId': orderId },
//           { $set: { 'orders.$.status': 'Cancelled' } }
//         );
//       }
//     } else {
//       order.items = order.items.map((item) => {
//         const updatedItem = items.find(
//           (i) => i.productId.toString() === item.productId.toString()
//         );
//         if (updatedItem) {
//           item.quantity = updatedItem.quantity;
//         }
//         return item;
//       });

//       for (const item of order.items) {
//         const bakerId = item.bakerId;
//         await bakerModel.updateOne(
//           { _id: bakerId, 'orders.orderId': orderId, 'orders.items.productId': item.productId },
//           { $set: { 'orders.$.items.$[elem].quantity': item.quantity } },
//           { arrayFilters: [{ 'elem.productId': item.productId }] }
//         );
//       }
//     }

//     await order.save();

//     res.json({ success: true, order });
//   } catch (error) {
//     console.error("Error updating order:", error);
//     res.status(500).json({ success: false, message: "Error updating order" });
//   }
// };


// export { updateOrder, createOrder, updateOrderStatus, getBakerOrders, verifyOrder, getUserOrders, checkOrderStatus};

import bakerModel from "../models/bakerModel.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createOrder = async (req, res) => {
  const frontend_URL = "http://localhost:5173";
  const deliveryCharge = 40;
  const currency = "inr";

  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const { firstname, lastname, email, address, phone } = req.body;
    const cartData = user.cartData;
    let items = [];
    let totalPrice = 0;
    let bakerItemsMap = {};

    for (let itemId in cartData) {
      const product = await productModel.findById(itemId);
      if (product) {
        const quantity = cartData[itemId];
        const itemPrice = product.price * quantity;
        items.push({
          productId: product._id,
          bakerId: product.bakerid,
          quantity,
          price: product.price,
        });
        totalPrice += itemPrice;

        if (!bakerItemsMap[product.bakerid]) {
          bakerItemsMap[product.bakerid] = [];
        }
        bakerItemsMap[product.bakerid].push({
          productId: product._id,
          quantity,
          price: product.price,
        });
      }
    }

    const newOrder = new orderModel({
      userId: user._id,
      firstname,
      lastname,
      email,
      address,
      phone,
      totalPrice: totalPrice + deliveryCharge,
      items,
    });
    const savedOrder = await newOrder.save();

    for (let bakerId in bakerItemsMap) {
      const baker = await bakerModel.findById(bakerId);
      if (baker) {
        baker.orders.push({
          orderId: savedOrder._id,
          items: bakerItemsMap[bakerId],
          status: "Pending",
        });
        await baker.save();
      }
    }

    user.cartData = {};
    await user.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.productId.toString(),
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charge",
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${frontend_URL}/verify?success=true&orderId=${savedOrder._id}`,
      cancel_url: `${frontend_URL}/verify?success=false&orderId=${savedOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error creating order" });
  }
};

const getBakerOrders = async (req, res) => {
  try {
    const bakerId = req.body.userId;

    // Find the baker
    const baker = await bakerModel.findById(bakerId);
    if (!baker) {
      return res.status(404).json({ success: false, message: "Baker not found" });
    }

    const formattedOrders = [];

    for (const orderInfo of baker.orders) {
      const order = await orderModel.findById(orderInfo.orderId)
        .populate('userId', 'firstname lastname email phone address'); // Populate user details

      if (!order) continue;

      const items = order.items.filter(item => item.bakerId.toString() === bakerId);

      if (items.length === 0) continue;

      let totalPrice = 0;

      const formattedItems = await Promise.all(items.map(async (item) => {
        const product = await productModel.findById(item.productId);

        if (!product) return null; // Skip if product is missing

        const itemTotalPrice = item.quantity * item.price;
        totalPrice += itemTotalPrice;

        return {
          name: product.name, // Fetch product name
          quantity: item.quantity,
          price: item.price,
          image: product.image, // Fetch product image
          totalPrice: itemTotalPrice
        };
      }));

      const orderDetails = {
        user: {
          name: `${order.firstname} ${order.lastname}`,
          email: order.email,
          phone: order.phone,
          address: order.address,
        },
        items: formattedItems.filter(item => item !== null), // Exclude null items
        totalPrice: totalPrice,
        status: order.status,
      };

      formattedOrders.push(orderDetails);
    }

    res.json({ success: true, data: formattedOrders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error retrieving orders" });
  }
};


const updateOrderStatus = async (req, res) => {
  console.log(req.body);
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: "Status Updated" })
  } catch (error) {
    res.json({ success: false, message: "Error" })
  }
}

const getUserOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId }).populate({
      path: 'items.productId',
      select: 'name price image',
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error retrieving orders" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" })
    }
    else {
      await orderModel.findByIdAndDelete(orderId)
      res.json({ success: false, message: "Not Paid" })
    }
  } catch (error) {
    res.json({ success: false, message: "Not  Verified" })
  }
}

const updateOrder = async (req, res) => {
  const { orderId, items, cancel } = req.body;

  try {
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.canclelled) {
      return res.status(400).json({ success: false, message: "Order has already been cancelled" });
    }

    if (cancel) {
      order.canclelled = true;

      for (const item of order.items) {
        const bakerId = item.bakerId;
        await bakerModel.updateOne(
          { _id: bakerId, 'orders.orderId': orderId },
          { $set: { 'orders.$.status': 'Cancelled' } }
        );
      }
    } else {
      order.items = order.items.map(item => {
        const updatedItem = items.find(i => i.productId.toString() === item.productId.toString());
        if (updatedItem) {
          item.quantity = updatedItem.quantity;
        }
        return item;
      });

      for (const item of order.items) {
        const bakerId = item.bakerId;
        await bakerModel.updateOne(
          { _id: bakerId, 'orders.orderId': orderId, 'orders.items.productId': item.productId },
          { $set: { 'orders.$.items.$[elem].quantity': item.quantity } },
          { arrayFilters: [{ 'elem.productId': item.productId }] }
        );
      }
    }

    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ success: false, message: "Error updating order" });
  }
};

export { updateOrder, createOrder, updateOrderStatus, getBakerOrders, verifyOrder, getUserOrders };

