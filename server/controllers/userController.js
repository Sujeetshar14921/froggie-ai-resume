import User from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Resume from "../models/Resume.js";
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
            return res.status(400).json({message: 'Missing required fields'})
        }

        // check if user already exists
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({message: 'User already exists'})
        }

        // create new user
         const hashedPassword = await bcrypt.hash(password, 10)
         const newUser = await User.create({
            name, email, password: hashedPassword
         })

         // return success message
         const token = generateToken(newUser._id)
         newUser.password = undefined;

         return res.status(201).json({message: 'User created successfully', token, user: newUser})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// controller for user login
// POST: /api/users/login
export const loginUser = async (req, res) => {
    try {
        const { email, password} = req.body;

        // check if user exists
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: 'Invalid email or password'})
        }

        // check if password is correct
        if(!user.comparePassword(password)){
            return res.status(400).json({message: 'Invalid email or password'})
        }

        // return success message
         const token = generateToken(user._id)
         user.password = undefined;

         return res.status(200).json({message: 'Login successful', token, user})

    } catch (error) {
        return res.status(400).json({message: error.message})
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
        // return user
        user.password = undefined;
         return res.status(200).json({user})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// controller for getting user resumes
// GET: /api/users/resumes
export const getUserResumes = async (req, res) => {
    try {
        const userId = req.userId;

        // return user resumes
        const resumes = await Resume.find({userId})
        return res.status(200).json({resumes})
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