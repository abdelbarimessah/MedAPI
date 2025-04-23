const mongoose = require("mongoose");
const env = require('./env.config');

const dbConnect = async () => {
  try {
    await mongoose.connect(env.DB_URI);
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = dbConnect;