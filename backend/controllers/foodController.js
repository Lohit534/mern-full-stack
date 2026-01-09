import foodModel from "../models/foodModel.js";
import { v2 as cloudinary } from 'cloudinary';

const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const addFood = async (req, res) => {
  try {
    // Cloudinary returns the full URL in req.file.path
    let image_url = req.file.path;

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: image_url, // Store full Cloudinary URL
    });

    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);

    // Delete image from Cloudinary if it exists
    if (food.image && food.image.includes('cloudinary.com')) {
      // Extract public_id from Cloudinary URL
      const urlParts = food.image.split('/');
      const publicIdWithExtension = urlParts.slice(-2).join('/');
      const publicId = publicIdWithExtension.split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { listFood, addFood, removeFood };
