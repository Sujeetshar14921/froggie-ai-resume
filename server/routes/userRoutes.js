import express from "express";
import { getUserById, getUserResumes, loginUser, registerUser, updateUserProfile } from "../controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";
import upload from "../configs/multer.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/data', protect, getUserById);
userRouter.get('/resumes', protect, getUserResumes);
userRouter.put('/profile', upload.single('image'), protect, updateUserProfile);

export default userRouter;