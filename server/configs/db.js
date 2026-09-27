import mongoose from "mongoose";

let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    try {
      let mongodbURI = process.env.MONGODB_URI;

      if (!mongodbURI) {
        throw new Error("MONGODB_URI environment variable is missing in .env file");
      }

      // Strip accidental quotes or trailing whitespaces
      mongodbURI = mongodbURI.trim().replace(/^["']|["']$/g, "").trim();

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

      return conn;
    } catch (error) {
      console.error("✗ Failed to connect to MongoDB:", error.message || error);
      if (error.name === "MongooseServerSelectionError") {
        console.error("💡 Troubleshooting Tip: Check your MongoDB Atlas IP Whitelist (add 0.0.0.0/0) and database user credentials.");
      }
      throw error;
    } finally {
      connectionPromise = null;
    }
  })();

  return connectionPromise;
};

export default connectDB;