import mongoose from "mongoose";

let isConnecting = false;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("MongoDB is already connected.");
    return mongoose.connection;
  }

  if (isConnecting) {
    console.log("MongoDB connection is already in progress...");
    return;
  }

  try {
    isConnecting = true;
    const mongodbURI = process.env.MONGODB_URI;

    if (!mongodbURI) {
      throw new Error("MONGODB_URI environment variable is missing in .env file");
    }

    // Set connection event listeners once
    if (mongoose.connection.listenerCount("connected") === 0) {
      mongoose.connection.on("connected", () => {
        console.log(`✓ MongoDB Connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
      });

      mongoose.connection.on("error", (err) => {
        console.error("✗ MongoDB Connection Error:", err.message || err);
      });

      mongoose.connection.on("disconnected", () => {
        console.warn("! MongoDB Disconnected. Reconnection will be attempted automatically.");
      });
    }

    const conn = await mongoose.connect(mongodbURI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip IPv6 resolution delays
    });

    isConnecting = false;
    return conn;
  } catch (error) {
    isConnecting = false;
    console.error("✗ Failed to connect to MongoDB:", error.message || error);
    // Suggest common Atlas fixes if applicable
    if (error.name === "MongooseServerSelectionError") {
      console.error("💡 Troubleshooting Tip: Check your MongoDB Atlas IP Whitelist (add 0.0.0.0/0) and database user credentials.");
    }
    throw error;
  }
};

export default connectDB;