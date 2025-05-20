    import express from "express";
    import cors from "cors";
    import mongoose from "mongoose";
    import dotenv from "dotenv";
    import authRoutes from "./routes/authRoutes";
    const app=express();
    const Port="3000";


    dotenv.config();

    app.use(cors());

    app.use(express.json());

    app.use('/api/auth',authRoutes);    


    mongoose.connect(process.env.mongo_ur!).then(()=>{

        console.log("connected to db");
        
        app.listen(Port,()=>{
            console.log("the server is up and running");
            
        })
    })
    .catch(err=>console.error("db error",err));