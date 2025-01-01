import express from "express";
import { verifySignIn } from "../controllers/authController.js";
import { createPost, getPosts, updatePostWithLikes } from "../controllers/postsController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get('/',verifySignIn,getPosts);
router.post('/',verifySignIn,upload.single("file") ,createPost);
router.put('/like', verifySignIn, updatePostWithLikes)

export default router;