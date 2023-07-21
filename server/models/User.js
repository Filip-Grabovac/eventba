const mongoose = require("mongoose");
const connectDB = require("../db/connect");

const UserSchema = new mongoose.Schema({
  id: { type: Number },
  name: { type: String },
  lname: { type: String },
  email: { type: String },
  fbEmail: { type: String },
  address: { type: String },
  city: { type: String },
  country: { type: String },
  role: { type: String },
  zip: { type: Number },
  phone: { type: String },
  password: { type: String, minlength: 6 },
  isVerified: { type: Boolean },
  verificationCode: { type: Number },
  accountType: { type: String },
  profileImg: { type: String },
  buyHistory: { type: Array },
});

module.exports = connectDB(process.env.DATABASE_URL).model(
  "User",
  UserSchema,
  "users"
);
