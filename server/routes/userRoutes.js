import express from "express";
import { 
  getUserById, 
  getUserResumes, 
  loginUser, 
  registerUser, 
  updateUserProfile,
  changePasswordController,
  deactivateUserAccount,
  deleteUserAccount,
  sendSignupOtpController,
  verifySignupOtpController,
  sendResetPasswordOtpController,
  verifyResetPasswordOtpController
} from "../controllers/userController.js";
import { initiateOAuth, handleOAuthCallback } from "../controllers/oauthController.js";
import protect from "../middlewares/authMiddleware.js";
import upload from "../configs/multer.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const userRouter = express.Router();

userRouter.post('/register', authLimiter, registerUser);
userRouter.post('/send-signup-otp', authLimiter, sendSignupOtpController);
userRouter.post('/verify-signup-otp', authLimiter, verifySignupOtpController);
userRouter.post('/login', authLimiter, loginUser);
userRouter.post('/send-reset-otp', authLimiter, sendResetPasswordOtpController);
userRouter.post('/reset-password', authLimiter, verifyResetPasswordOtpController);
userRouter.get('/data', protect, getUserById);
userRouter.get('/resumes', protect, getUserResumes);
userRouter.put('/profile', upload.single('image'), protect, updateUserProfile);
userRouter.put('/change-password', protect, changePasswordController);
userRouter.post('/deactivate', protect, deactivateUserAccount);
userRouter.delete('/account', protect, deleteUserAccount);

// Social OAuth 2.0 routes
userRouter.get('/auth/:provider', initiateOAuth);
userRouter.get('/auth/:provider/callback', handleOAuthCallback);

export default userRouter;