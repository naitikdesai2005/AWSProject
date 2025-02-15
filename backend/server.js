import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import userRouter from './routes/userRoute.js'
import bakerRouter from './routes/bakerRoute.js'
import productRouter from './routes/productRoute.js'
import 'dotenv/config'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import reviewRouter from './routes/reviewRoute.js';
import adminRouter from './routes/adminRoute.js'

//app config
const app = express()
const port = 3000

//middleware
app.use(express.json())
app.use(cors())

//db connection
connectDB()

//api endpoints
// app.use("/api/food",foodRouter)
app.use("/uploads",express.static('uploads'))
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/user",userRouter);
app.use("/api/baker",bakerRouter);
app.use("/api/admin",adminRouter);
app.use("/api/product",productRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);
app.use('/api/reviews', reviewRouter);

app.get("/",(req,res)=>{
    res.send("API Working...!!!")
})

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`)
})
