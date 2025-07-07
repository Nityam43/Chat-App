const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("mongo db database connected");
  } catch (error) {
    console.error("error connecting database", error.message);
    process.exit(1);
  }
};

module.exports = connectDb;