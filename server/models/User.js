import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    authProvider: {
        type: String,
        enum: ['local', 'google', 'github', 'linkedin', 'facebook'],
        default: 'local'
    },
    providerId: { type: String, default: '' },
    image: { type: String, default: '' },
    profession: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    bio: { type: String, default: '' },
}, { timestamps: true })

UserSchema.methods.comparePassword = function (password){
    if (!this.password) return false;
    return bcrypt.compareSync(password, this.password)
}

const User = mongoose.model("User", UserSchema)

export default User;