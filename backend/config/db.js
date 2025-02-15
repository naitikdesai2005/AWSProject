import mongoose from "mongoose"


export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://naitik05:naitik05@cluster0.qhhftx9.mongodb.net/homebakery').then(()=>console.log("DB connected"));
}