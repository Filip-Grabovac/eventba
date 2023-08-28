const mongoose = require("mongoose");
const connectDB = require("../db/connect");

const UserSchema = new mongoose.Schema({
  full_name: { type: String },
  newsletter: { type: Boolean, default: false },
  email: { type: String },
  fbEmail: { type: String },
  address: { type: String },
  city: { type: String },
  country: { type: String },
  role: { type: String },
  zip: { type: Number },
  phone: { type: String },
  password: { type: String, minlength: 6 },
  is_verified: { type: Boolean },
  verificationCode: { type: Number },
  profile_img: { type: String },
  buy_history: { type: Array },
  is_banned: { type: Boolean },
  reseller_info: { type: Object },
  resellers_requests: { type: Array, default: undefined },
});

module.exports = connectDB(process.env.DATABASE_URL).model(
  "User",
  UserSchema,
  "users"
);
