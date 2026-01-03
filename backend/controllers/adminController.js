import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
import adminModel from "../models/adminModel.js";
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// Google OAuth Login for Admin
const googleLoginAdmin = async (req, res) => {
    const { credential } = req.body;

    try {
        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name } = payload;

        // Check if admin exists
        let admin = await adminModel.findOne({ email });

        if (admin) {
            // Admin exists - login
            if (!admin.googleId) {
                admin.googleId = googleId;
                admin.authProvider = 'google';
                await admin.save();
            }
        } else {
            // Create new admin
            admin = new adminModel({
                name,
                email,
                googleId,
                authProvider: 'google',
                password: undefined,
            });
            await admin.save();
        }

        const token = createToken(admin._id);
        res.json({ success: true, token, admin: { name: admin.name, email: admin.email } });
    } catch (error) {
        console.error('Google admin login error:', error);
        res.json({ success: false, message: "Google authentication failed" });
    }
};

// login admin
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await adminModel.findOne({ email });

        if (!admin) {
            return res.json({ success: false, message: "Admin does not exist" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(admin._id);
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// register admin
const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // checking if admin already exists
        const exists = await adminModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "Admin already exists" });
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // hashing admin password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new adminModel({
            name,
            email,
            password: hashedPassword
        })

        const admin = await newAdmin.save();
        const token = createToken(admin._id);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

export { loginAdmin, registerAdmin, googleLoginAdmin };
