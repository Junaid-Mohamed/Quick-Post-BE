import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 3000

const app = express();
app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>res.send('Hi World'))
app.use('/api/auth',authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/posts',postRoutes);

app.listen(PORT,()=> console.log(`App listening on PORT ${PORT}`));