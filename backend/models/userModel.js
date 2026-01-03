import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Optional for Google users
    googleId: { type: String, required: false }, // Google user ID
    authProvider: { type: String, enum: ['email', 'google'], default: 'email' }, // Track auth method
    cartData: { type: Object, default: {} }
}, { minimize: false })

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;