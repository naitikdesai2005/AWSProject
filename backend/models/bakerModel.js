import mongoose from "mongoose";
const bakerSchema = new mongoose.Schema({
    name:{type:String,required:true},
    bakeryname:{type:String,required:true},
    bakeryaddress:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    mobilenumber:{type:Number,required:true},
    bankAccNumber:{type:Number,required:true},
    gender:{type:String},
    image:{type:String,default:"default_avtar"},
    link:{type:String},
    bio:{type:String},
    role:{type:String,default:"baker"},
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product' }],
    select:{type:Boolean,default:true},
    resetCode:{type:String},
    resetCodeExpires:{type:String},
    orders: [
        {
            orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'order', required: true },
            items: [
                {
                    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
                    quantity: { type: Number, required: true },
                    price:{type:Number,required:true}
                }
            ],
            status: { type: String, default: "Pending" }
        }
    ]

},{minimize:false})

const bakerModel = mongoose.models.baker || mongoose.model("baker",bakerSchema);
export default bakerModel;
