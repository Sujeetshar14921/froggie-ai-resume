import User from "../models/User.js";
import Otp from "../models/Otp.js";
import { sendSignupOtp, sendResetPasswordOtp } from "../services/emailService.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Resume from "../models/Resume.js";
import AtsReport from "../models/AtsReport.js";
import fs from "fs";
import imagekit from "../configs/imageKit.js";


const generateToken = (userId)=>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '7d'})
    return token;
}

// controller for user registration
// POST: /api/users/register
export const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        // check if required fields are present
        if(!name || !email || !password){
            return res.status(400).json({message: 'Please fill in all required fields'})
        }

        if (password.length < 6) {
            return res.status(400).json({message: 'Password must be at least 6 characters long'})
        }

        const cleanEmail = email.trim().toLowerCase();

        // check if user already exists
        const user = await User.findOne({email: cleanEmail})
        if(user){
            if (user.authProvider && user.authProvider !== 'local') {
                return res.status(400).json({
                    message: `An account with this email already exists via ${user.authProvider.toUpperCase()}. Please sign in with ${user.authProvider.toUpperCase()}.`
                });
            }
            return res.status(400).json({message: 'Account already exists with this email. Please sign in.'})
        }

        // create new user
         const hashedPassword = await bcrypt.hash(password, 10)
         const newUser = await User.create({
            name: name.trim(), email: cleanEmail, password: hashedPassword
         })

         // return success message
         const token = generateToken(newUser._id)
         const userObj = newUser.toObject();
         userObj.hasPassword = true;
         delete userObj.password;

         return res.status(201).json({message: 'Account created successfully', token, user: userObj})

    } catch (error) {
        return res.status(400).json({message: error.message || 'Registration failed'})
    }
}

// controller for user login
// POST: /api/users/login
export const loginUser = async (req, res) => {
    try {
        const { email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({message: 'Please provide both email and password'})
        }

        const cleanEmail = email.trim().toLowerCase();

        // check if user exists
        const user = await User.findOne({email: cleanEmail})
        if(!user){
            return res.status(400).json({message: 'Invalid email or password'})
        }

        // If user registered with Google/OAuth and has no password
        if (user.authProvider && user.authProvider !== 'local' && !user.password) {
            const providerName = user.authProvider.charAt(0).toUpperCase() + user.authProvider.slice(1);
            return res.status(400).json({
                message: `This account was registered using ${providerName}. Please use the "${providerName}" button below to sign in.`
            });
        }

        // check if password is correct
        if(!user.comparePassword(password)){
            return res.status(400).json({message: 'Invalid email or password'})
        }

        // return success message
        const token = generateToken(user._id)
        const userObj = user.toObject();
        userObj.hasPassword = Boolean(user.password);
        delete userObj.password;

        return res.status(200).json({message: 'Login successful', token, user: userObj})
    } catch (error) {
        return res.status(400).json({message: error.message || 'Login failed'})
    }
}

// controller for getting user by id
// GET: /api/users/data
export const getUserById = async (req, res) => {
    try {
        const userId = req.userId;

        // check if user exists
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({message: 'User not found'})
        }
        
        const userObj = user.toObject();
        userObj.hasPassword = Boolean(user.password);
        delete userObj.password;
        return res.status(200).json({user: userObj})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// controller for getting user resumes
// GET: /api/users/resumes
export const getUserResumes = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('image').lean();
        const userImage = user?.image || '';

        // return user resumes with profile photo fallback
        const resumes = await Resume.find({userId}).lean();
        const enrichedResumes = resumes.map((r) => {
            if (!r.personal_info?.image && userImage) {
                return {
                    ...r,
                    personal_info: {
                        ...(r.personal_info || {}),
                        image: userImage
                    }
                };
            }
            return r;
        });

        return res.status(200).json({resumes: enrichedResumes})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// controller for updating user profile
// PUT: /api/users/profile
export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, profession, phone, location, bio, removeImage } = req.body;
        const image = req.file;

        const updateData = {};
        if (name) updateData.name = name.trim();
        if (profession !== undefined) updateData.profession = profession.trim();
        if (phone !== undefined) updateData.phone = phone.trim();
        if (location !== undefined) updateData.location = location.trim();
        if (bio !== undefined) updateData.bio = bio.trim();

        if (removeImage === 'true' || removeImage === true) {
            updateData.image = '';
        }

        if (image) {
            const imageBufferData = fs.createReadStream(image.path);
            const response = await imagekit.files.upload({
                file: imageBufferData,
                fileName: `user_${userId}_${Date.now()}.png`,
                folder: 'user-profiles',
                transformation: {
                    pre: 'w-300,h-300,fo-face,z-0.75'
                }
            });
            updateData.image = response.url;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// controller for updating user password
// PUT: /api/users/change-password
export const changePasswordController = async (req, res) => {
    try {
        const userId = req.userId;
        const { currentPassword, newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If user already has a password, verify current password
        if (user.password) {
            if (!currentPassword) {
                return res.status(400).json({ message: 'Current password is required' });
            }
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        const userObj = user.toObject();
        userObj.hasPassword = true;
        delete userObj.password;

        return res.status(200).json({ message: 'Password updated successfully!', user: userObj });
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Failed to update password' });
    }
};

// controller for deactivating user account
// POST: /api/users/deactivate
export const deactivateUserAccount = async (req, res) => {
    try {
        const userId = req.userId;
        const { reason, feedback, partedAdvice } = req.body || {};

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isDeactivated = true;
        user.deactivationReason = reason || 'User requested deactivation';
        user.feedback = {
            reason,
            feedback,
            partedAdvice,
            deactivatedAt: new Date()
        };
        await user.save();

        // Protect privacy: make all public resumes private while deactivated
        await Resume.updateMany({ userId }, { isPublic: false });

        return res.status(200).json({ 
            message: 'Account successfully deactivated. All your public resumes are now private.' 
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// controller for permanently deleting user account and all personal data
// DELETE: /api/users/account
export const deleteUserAccount = async (req, res) => {
    try {
        const userId = req.userId;
        const { reason, feedback, partedAdvice } = req.body || {};

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 1. Delete all associated resumes
        await Resume.deleteMany({ userId });

        // 2. Delete all ATS scanner audit reports
        await AtsReport.deleteMany({ userId });

        // 3. Finally delete the user account
        await User.findByIdAndDelete(userId);

        return res.status(200).json({ 
            message: 'Account and all related resumes, ATS scans, and data have been permanently deleted.' 
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Helper to generate 6-digit random code
const generate6DigitCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// controller to send OTP for signup verification
// POST: /api/users/send-signup-otp
export const sendSignupOtpController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const cleanEmail = email.trim().toLowerCase();

        // Check if user already exists
        const existing = await User.findOne({ email: cleanEmail });
        if (existing) {
            if (existing.authProvider && existing.authProvider !== 'local') {
                return res.status(400).json({
                    message: `An account with this email already exists via ${existing.authProvider.toUpperCase()}. Please sign in with ${existing.authProvider.toUpperCase()}.`
                });
            }
            return res.status(400).json({ message: 'Account already exists with this email. Please sign in.' });
        }

        const otp = generate6DigitCode();
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(`[AUTH OTP] Signup OTP generated for ${cleanEmail}: ${otp}`);

        // Delete any existing signup OTP for this email
        await Otp.deleteMany({ email: cleanEmail, purpose: 'signup' });

        // Save OTP
        await Otp.create({
            email: cleanEmail,
            otp,
            purpose: 'signup',
            metadata: {
                name: name.trim(),
                hashedPassword
            }
        });

        // Send OTP via SMTP
        try {
            await sendSignupOtp(cleanEmail, otp, name.trim());
        } catch (emailErr) {
            console.error('SMTP send error:', emailErr);
            return res.status(500).json({
                message: `Failed to send verification email. Please check your email or SMTP configuration (${emailErr.message})`
            });
        }

        return res.status(200).json({
            message: `Verification code sent to ${cleanEmail}. Please enter the 6-digit code.`
        });
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Failed to send verification code' });
    }
};

// controller to verify OTP and complete registration
// POST: /api/users/verify-signup-otp
export const verifySignupOtpController = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and 6-digit OTP code are required' });
        }

        const cleanEmail = email.trim().toLowerCase();
        const cleanOtp = otp.toString().trim();

        const otpRecord = await Otp.findOne({
            email: cleanEmail,
            otp: cleanOtp,
            purpose: 'signup'
        });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired verification code. Please request a new one.' });
        }

        // Re-check existing user to prevent race condition
        const existingUser = await User.findOne({ email: cleanEmail });
        if (existingUser) {
            await Otp.deleteMany({ email: cleanEmail, purpose: 'signup' });
            return res.status(400).json({ message: 'Account already exists with this email. Please sign in.' });
        }

        const { name, hashedPassword } = otpRecord.metadata || {};
        if (!name || !hashedPassword) {
            return res.status(400).json({ message: 'Registration session expired. Please start signup again.' });
        }

        const newUser = await User.create({
            name,
            email: cleanEmail,
            password: hashedPassword
        });

        // Clean up OTPs
        await Otp.deleteMany({ email: cleanEmail, purpose: 'signup' });

        const token = generateToken(newUser._id);
        newUser.password = undefined;

        return res.status(201).json({
            message: 'Email verified and account created successfully!',
            token,
            user: newUser
        });
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Verification failed' });
    }
};

// controller to send OTP for password reset
// POST: /api/users/send-reset-otp
export const sendResetPasswordOtpController = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Please provide your email address' });
        }

        const cleanEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: cleanEmail });

        if (!user) {
            return res.status(404).json({ message: 'No registered account found with this email address.' });
        }

        if (user.authProvider && user.authProvider !== 'local' && !user.password) {
            const providerName = user.authProvider.charAt(0).toUpperCase() + user.authProvider.slice(1);
            return res.status(400).json({
                message: `This account was registered using ${providerName}. Please use social login with ${providerName}.`
            });
        }

        const otp = generate6DigitCode();
        console.log(`[AUTH OTP] Password reset OTP generated for ${cleanEmail}: ${otp}`);

        // Delete any existing reset OTP for this email
        await Otp.deleteMany({ email: cleanEmail, purpose: 'reset_password' });

        await Otp.create({
            email: cleanEmail,
            otp,
            purpose: 'reset_password'
        });

        try {
            await sendResetPasswordOtp(cleanEmail, otp, user.name || 'User');
        } catch (emailErr) {
            console.error('SMTP reset send error:', emailErr);
            return res.status(500).json({
                message: `Failed to send password reset email (${emailErr.message})`
            });
        }

        return res.status(200).json({
            message: `Password reset code sent to ${cleanEmail}. Please check your inbox.`
        });
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Failed to send password reset code' });
    }
};

// controller to verify OTP and reset password
// POST: /api/users/reset-password
export const verifyResetPasswordOtpController = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'Email, OTP code, and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long' });
        }

        const cleanEmail = email.trim().toLowerCase();
        const cleanOtp = otp.toString().trim();

        const otpRecord = await Otp.findOne({
            email: cleanEmail,
            otp: cleanOtp,
            purpose: 'reset_password'
        });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired password reset code. Please request a new one.' });
        }

        const user = await User.findOne({ email: cleanEmail });
        if (!user) {
            return res.status(404).json({ message: 'User account not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        // Clean up OTPs
        await Otp.deleteMany({ email: cleanEmail, purpose: 'reset_password' });

        const token = generateToken(user._id);
        user.password = undefined;

        return res.status(200).json({
            message: 'Password reset successfully! You are now logged in.',
            token,
            user
        });
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Password reset failed' });
    }
};
