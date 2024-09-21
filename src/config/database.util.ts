import mongoose from "mongoose";
import "dotenv/config";
const mongooseConnect = async () => {
  const mongoDBUrl = process.env.MONGO_URI!;
  try {
    await mongoose.connect(mongoDBUrl);
    console.log("database connected successfully");
  } catch (error) {
    console.log("database connection failed", error);
    process.exit(1); // stop the application
  }
};
export { mongooseConnect };
