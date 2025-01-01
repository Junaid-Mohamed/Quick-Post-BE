import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 3000

const app = express();
app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>res.send('Hi World'))
app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);

app.listen(PORT,()=> console.log(`App listening on PORT ${PORT}`));