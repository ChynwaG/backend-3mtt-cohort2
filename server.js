import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import bodyParser from "body-parser";
import cors from "cors";


dotenv.config();
connectDB();


const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




app.get('/', (req, res)=> {
    res.send ("Hello From TaskMaster");
});
console.log('JWT Secret:', process.env.JWT_SECRET);
