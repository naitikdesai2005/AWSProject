import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import validator from "validator";
import bakerModel from "../models/bakerModel.js";
// import userModel from "../models/userModel.js";
import cookie from "cookie"
import fs from "fs"


const addItem = async (req, res) => {
  try {
    let bakerData = await bakerModel.findById(req.body.userId);
    let bn = bakerData.bakeryname;
    let bakerId = await bakerData._id;
    let image_filename = `${req.file.filename}`;
    const item = new productModel({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      bakerid: bakerId,
      image: image_filename,
      bakeryName: bn
    });


    const savedItem = await item.save();
    bakerData.products.push(savedItem._id);
    await bakerData.save();
    res.status(200).json({ success: true, message: "Item added successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Something went Wrong!!!" })
  }
}

// const listItem = async (req, res) => {
//     try {
//         const bakerData = await someFunctionToGetBakerData();
//         console.log("Baker Data:", bakerData); // Debugging output
//         if (!bakerData) {
//             throw new Error("Baker data not found");
//         }
//         let bakerId = bakerData._id;
//         // Continue with your logic using bakerId
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send({ error: error.message });
//     }
// };


//all item list
// const listItem=async(req,res)=>{

//     let bakerData = await bakerModel.findById(req.body.userId);
//     let bakerId= await bakerData._id;

//     if (!bakerData) {
//         return res.json({ success: false, message: "Baker data not found." });
//       }

//     let itm = [];
//     try {
//       const Items=await productModel.find({});

//       Items.forEach(Item => {
//         if(bakerId==Item.bakerid)
//         {
//             // res.json({success:true,data:Item});
//             itm.push(Item);
//         }
//         // else
//         // {
//         //     res.json({success:false,message:"Baker has no item."})
//         // }
//       });

//       res.json({success:true,data:itm});
//     } catch (error) {
//       res.json({success:false,message:"Error"});
//     }
//   }


const listItem = async (req, res) => {
  try {
    let bakerData = await bakerModel.findById(req.body.userId);
    // let bakerId= await bakerData._id;
    if (!bakerData) {
      return res.json({ success: false, message: "Baker not found" });
    }

    const items = await productModel.find({ bakerid: bakerData._id });
    if (items.length > 0) {
      res.json({ success: true, data: items });
    } else {
      res.json({ success: false, message: "Baker has no items" });
    }
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: "Error retrieving items" });
  }
}

// const deleteItem = async (req, res) => {
//   try {
//     const { productId } = req.body;

//     // Fetch the baker data
//     let bakerData = await bakerModel.findById(req.body.userId);
//     if (!bakerData) {
//       return res.json({ success: false, message: "Baker not found" });
//     }

//     // Fetch the product item data
//     const item = await productModel.findById(productId);
//     if (!item) {
//       return res.json({ success: false, message: "Item not found" });
//     }

//     // Check if the baker is the owner of the item
//     if (item.bakerid.toString() === bakerData._id.toString()) {
//       // Check if the product is part of any active orders
//       // const activeOrders = await bakerModel.find({
//       //   'orders.items.productId': productId,
//       //   'orders.status': { $in: ['Pending', 'Processing'] }
//       // });

//       // if (activeOrders.length > 0) {
//       //   return res.json({ success: false, message: "Product cannot be deleted, it is part of an active order" });
//       // }

//       // Delete the product image from the uploads folder
//       fs.unlink(`uploads/${item.image}`, (err) => {
//         if (err) {
//           console.error("Failed to delete image:", err.message);
//         }
//       });

//       // Remove product from baker's product list
//       bakerData.products = bakerData.products.filter(id => id.toString() !== productId);
//       await bakerData.save();

//       // Remove product from the product collection
//       await productModel.findByIdAndDelete(productId);

//       await userModel.updateMany(
//         { [`cartData.${productId}`]: { $exists: true } }, // Find all users with this product in their cart
//         { $unset: { [`cartData.${productId}`]: "" } }      // Remove the product from their cart
//       );

//       return res.json({ success: true, message: "Item deleted successfully from baker and all carts" });
//     } else {
//       return res.json({ success: false, message: "Baker is not verified for this item" });
//     }
//   } catch (error) {
//     console.error(error.message);
//     res.json({ success: false, message: "Error deleting item" });
//   }
// }

const deleteItem = async (req, res) => {
  try {
    const { productId } = req.body;

    // Fetch the baker data
    let bakerData = await bakerModel.findById(req.body.userId);
    if (!bakerData) {
      return res.json({ success: false, message: "Baker not found" });
    }

    // Fetch the product item data
    const item = await productModel.findById(productId);
    if (!item) {
      return res.json({ success: false, message: "Item not found" });
    }

    // Check if the baker is the owner of the item
    if (item.bakerid.toString() === bakerData._id.toString()) {
      // Delete the product image from the uploads folder
      await fs.promises.unlink(`uploads/${item.image}`);

      // Remove product from baker's product list
      bakerData.products = bakerData.products.filter(id => id.toString() !== productId);
      await bakerData.save();

      // Remove product from the product collection
      const deletedProduct = await productModel.findByIdAndDelete(productId);
      if (!deletedProduct) {
        return res.json({ success: false, message: "Failed to delete product" });
      }

      // Remove the product from users' carts
      const updatedUsers = await userModel.updateMany(
        { [`cartData.${productId}`]: { $exists: true } },
        { $unset: { [`cartData.${productId}`]: "" } }
      );
      console.log('Users updated:', updatedUsers);

      return res.json({ success: true, message: "Item deleted successfully from baker and all carts" });
    } else {
      return res.json({ success: false, message: "Baker is not verified for this item" });
    }
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: "Error deleting item" });
  }
};

export { addItem, listItem, deleteItem };
