require("dotenv").config();
const mongoose = require("mongoose");
const mongoURI = process.env.MONGODB_URI;
let connectionPromise;

const connectToMongo = async () => {
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoURI).catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }

  await connectionPromise;
};

module.exports = connectToMongo;
