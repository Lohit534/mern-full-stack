import mongoose from "mongoose";

export const connectDB = async () => {
  console.log("MONGO_URI:", process.env.MONGO_URI); // Log the MONGO_URI for debugging
  await mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Database Connected"))
    .catch((err) => console.error("Database Connection Failed: ", err.message));
};
