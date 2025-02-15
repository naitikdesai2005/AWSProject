import mongoose from "mongoose";
const contactusSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    phone:{ type: Number, required: true },
    message:{type:String,required:true},
    date:{type:Date,default:Date.now}
},{minimize:false})

const contactusModel = mongoose.models.contactus || mongoose.model("contactus",contactusSchema);
export default contactusModel;