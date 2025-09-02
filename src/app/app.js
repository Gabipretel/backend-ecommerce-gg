import express from "express";
import cors from "cors";
import apiRoutes from "../routes/index.js";
import morgan from "morgan";
import errorHandler from "../middleware/errorHandler.js";

const app = express();

const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];
const corsOptions = {
    origin: (origin,callback) => {
        if(!origin || allowedOrigins.includes(origin)){
            callback(null, true);
        }else {
            callback(new Error("No permitido por CORS"))
        }
    },
    methods:['GET','POST','PUT','DELETE','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,

};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", apiRoutes);

app.use(errorHandler);

export default app;
