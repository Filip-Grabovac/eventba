const mongoose = require("mongoose");

let connections = {};

const connectDB = (databaseUrl) => {
  const databaseName = extractDatabaseName(databaseUrl);

  if (!connections[databaseName]) {
    try {
      console.log(`Connecting to database ${databaseName}`);
      connections[databaseName] = mongoose.createConnection(databaseUrl, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      });
    } catch (error) {
      console.log(
        `Failed to connect to database ${databaseName}: ${error.message}`
      );
      throw error;
    }
  }

  return connections[databaseName];
};

const extractDatabaseName = (databaseUrl) => {
  if (!databaseUrl || typeof databaseUrl !== "string") {
    console.error("Invalid database URL:", databaseUrl);
    return null; // or throw an error, depending on your error handling strategy
  }

  const urlParts = databaseUrl.split("/");
  const dbNameWithParams = urlParts[urlParts.length - 1];
  const dbName = dbNameWithParams.split("?")[0];
  return dbName;
};

module.exports = connectDB;
