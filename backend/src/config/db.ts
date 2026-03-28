import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is not set");
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`🍃 MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Error connecting to MongoDB: ${message}`);
    process.exit(1);
  }
};

export default connectDB;
