import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
            bakerId: { type: mongoose.Schema.Types.ObjectId, ref: 'baker', required: true },
            quantity: { type: Number, required: true },
            price:{type:Number,required:true},
            status: { type: String, default: "Pending" }
        }
    ],
    payment:{type:Boolean,default:false},
    cancelled:{type:Boolean,default:false}
}, { minimize: false });

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
