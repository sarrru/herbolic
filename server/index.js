// import express from 'express'
// import cors from 'cors'
// import dotenv from 'dotenv'
// dotenv.config()
// import cookieParser from 'cookie-parser'
// import morgan from 'morgan'
// import helmet from 'helmet'
// import connectDB from './config/connectDB.js'
// import userRouter from './route/user.route.js'
// import categoryRouter from './route/category.route.js'
// import uploadRouter from './route/upload.router.js'
// import subCategoryRouter from './route/subCategory.route.js'
// import productRouter from './route/product.route.js'
// import cartRouter from './route/cart.route.js'
// import addressRouter from './route/address.route.js'
// import orderRouter from './route/order.route.js'

// const app = express()
// app.use(cors({
//     credentials : true,
//     origin : process.env.FRONTEND_URL
// }))
// app.use(express.json())
// app.use(cookieParser())
// app.use(morgan())
// app.use(helmet({
//     crossOriginResourcePolicy : false
// }))

// const PORT = 8080 || process.env.PORT 


// app.get("/",(request,response)=>{
//     ///server to client
//     response.json({
//         message : "Server is running " + PORT
//     })
// })

// app.use('/api/user',userRouter)
// app.use("/api/category",categoryRouter)
// app.use("/api/file",uploadRouter)
// app.use("/api/subcategory",subCategoryRouter)
// app.use("/api/product",productRouter)
// app.use("/api/cart",cartRouter)
// app.use("/api/address",addressRouter)
// app.use('/api/order',orderRouter)

// connectDB().then(()=>{
//     app.listen(PORT,()=>{
//         console.log("Server is running",PORT)
//     })
// })

// Core modules
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // 👈 Add this
const __dirname = path.dirname(fileURLToPath(import.meta.url)); //

// Custom modules
import connectDB from './config/connectDB.js';
import userRouter from './route/user.route.js';
import categoryRouter from './route/category.route.js';
import uploadRouter from './route/upload.router.js';
import subCategoryRouter from './route/subCategory.route.js';
import productRouter from './route/product.route.js';
import cartRouter from './route/cart.route.js';
import addressRouter from './route/address.route.js';
import orderRouter from './route/order.route.js';

// Load .env variables
dotenv.config();

// Create express app
const app = express();

// Middlewares
app.use(cors({
  credentials: true,
  origin: process.env.FRONTEND_URL,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "✅ Server is running on HTTPS" });
});

// API routes
app.use('/api/user', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/file', uploadRouter);
app.use('/api/subcategory', subCategoryRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

// Load SSL cert and key from root cert/ folder
const sslOptions = {
 key: fs.readFileSync(path.join(__dirname, '../client/cert/key.pem')),
cert: fs.readFileSync(path.join(__dirname, '../client/cert/cert.pem')),

};

// Set port from .env or default to 8443
const PORT = process.env.PORT || 8443;

// Connect to DB and start HTTPS server
connectDB().then(() => {
  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`✅ HTTPS Server running at https://localhost:${PORT}`);
  });
});
