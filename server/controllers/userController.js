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
         newUser.password = undefined;

         return res.status(201).json({message: 'Account created successfully', token, user: newUser})

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
         user.password = undefined;

         return res.status(200).json({message: 'Login successful', token, user})

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