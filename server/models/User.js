const mongoose = require("mongoose");

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
  phone: { type: Number },
  password: { type: String, minlength: 5 },
  isVerified: { type: Boolean },
  verificationCode: { type: Number },
  accountType: { type: String },
  profileImg: { type: String },
});

module.exports = mongoose.model("User", UserSchema, "users");
