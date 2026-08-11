import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from './routes/auth.js';
import tripRoutes from './routes/trips.js'; 

dotenv.config();

connectDB();

const app=express();


app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes); 
app.get("/",(req,res)=>
{
    res.send("tripvault API is running...");
});

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>
{
    console.log(`Server running onport ${PORT}`);
});