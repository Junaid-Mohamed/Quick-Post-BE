import express from "express";
import { signIn, signUp, verifyToken } from "../controllers/authontroller.js";

const router = express.Router();

router.post('/signin', signIn);
router.post('/signup', signUp);
router.get('/signin', verifyToken)

export default router;