import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const PORT = process.env.PORT || 3000

const app = express();
app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>res.send('Hi World'))

app.listen(PORT,()=> console.log(`App listening on PORT ${PORT}`));