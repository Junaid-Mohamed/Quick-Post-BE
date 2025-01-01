import express from "express";

import { verifySignIn } from "../controllers/authontroller.js";
import { deleteUserPostById, getAllUsers, getBookmarkedPosts, getSecondaryUser, getUserById, getUserPosts, updateFollow, updatePostWithBookmark, updateUserPostById, updateUserProfile } from "../controllers/userController.js";

const router = express.Router();

router.get('/', verifySignIn,getUserById)
router.get('/allusers',verifySignIn,getAllUsers);
router.get('/user/:id', verifySignIn,getSecondaryUser)
router.get('/posts/user/:id', verifySignIn,getUserPosts)
router.delete('/:id',verifySignIn, deleteUserPostById)
router.put('/:id', verifySignIn, updateUserPostById)
router.get('/posts/bookmark',verifySignIn, getBookmarkedPosts)
router.put("/posts/bookmark",verifySignIn, updatePostWithBookmark)
router.put("/profile/userprofile",verifySignIn, updateUserProfile)
router.put("/profile/follows",verifySignIn, updateFollow)
export default router;