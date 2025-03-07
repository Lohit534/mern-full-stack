import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://Lohit123:Lohit123@cluster0.cb0pa.mongodb.net/mernfullstack"
    )
    .then(() => console.log("DB Connected"));
};
