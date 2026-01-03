import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Optional for Google admins
    googleId: { type: String, required: false }, // Google user ID
    authProvider: { type: String, enum: ['email', 'google'], default: 'email' }, // Track auth method
}, { minimize: false })

const adminModel = mongoose.models.admin || mongoose.model("admin", adminSchema);

export default adminModel;
