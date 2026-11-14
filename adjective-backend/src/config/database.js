const mongoose = require("mongoose");
const dns = require("dns");

// Optional: Prevents some MongoDB Atlas DNS resolution issues
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {
  console.warn("Unable to configure custom DNS servers.");
}

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI ;
    const conn = await mongoose.connect(uri, {
      ...(process.env.MONGODB_DB_NAME && { dbName: process.env.MONGODB_DB_NAME }),
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📂 Database: ${conn.connection.name}`);

    // Connection Events
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB Error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB Disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🔄 MongoDB Reconnected");
    });

  } catch (err) {
    console.error("❌ Failed to connect to MongoDB");
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;