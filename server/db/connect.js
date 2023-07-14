const mongoose = require("mongoose");

const connectDB = (databaseUrl) => {
  try {
    const connection = mongoose.createConnection(databaseUrl, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    return connection;
  } catch (error) {
    console.log(`Failed to connect to database: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
