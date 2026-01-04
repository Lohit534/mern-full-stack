import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
import userModel from "../models/userModel.js";
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Google OAuth Login
const googleLogin = async (req, res) => {
  const { credential, accessToken } = req.body;

  try {
    let email, name, googleId;

    if (accessToken) {
      // Verify Access Token via Google UserInfo API
      // Dynamic import axios if not using require/import at top-level to avoid issues, or just import at top.
      // Since I added axios to package.json, I will import it at the top.
      const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      email = response.data.email;
      name = response.data.name;
      googleId = response.data.sub;
    } else if (credential) {
      // Verify Google ID Token (Legacy/Standard)
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      email = payload.email;
      name = payload.name;
      googleId = payload.sub;
    } else {
      return res.json({ success: false, message: "No token provided" });
    }

    // Check if user exists
    let user = await userModel.findOne({ email });

    if (user) {
      // User exists - login
      // Update googleId if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
        await user.save();
      }
    } else {
      // Create new user
      user = new userModel({
        name,
        email,
        googleId,
        authProvider: 'google',
        password: undefined, // No password for Google users
      });
      await user.save();
    }

    const token = createToken(user._id);
    res.json({ success: true, token, user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error('Google login error:', error);
    res.json({ success: false, message: "Google authentication failed" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { loginUser, registerUser, googleLogin };
