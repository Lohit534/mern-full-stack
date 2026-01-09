import express from 'express';
import { addFood, listFood, removeFood } from '../controllers/foodController.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const foodRouter = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'foodie-del',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    }
});

const upload = multer({ storage: storage });

foodRouter.get("/list", listFood);
foodRouter.post("/add", upload.single('image'), addFood);
foodRouter.post("/remove", removeFood);

export default foodRouter;