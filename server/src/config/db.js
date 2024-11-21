import mongoose from "mongoose";

export const connectDB = async () => {
  try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log("MONGODB CONNECTED");
  } catch (err) {
    console.log("FAILED TO CONNECT TO DATABASE",err)
    process.exit();
  }
};