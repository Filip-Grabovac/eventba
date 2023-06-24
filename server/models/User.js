const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id: { type: Number },
  name: { type: String },
  lname: { type: String },
  email: { type: String },
  address: { type: String },
  city: { type: String },
  country: { type: String },
  zip: { type: Number },
  phone: { type: Number },
  password: { type: String },
  isVerified: { type: Boolean },
  accountType: { type: String },
  profileImg: { type: String },
});

module.exports = mongoose.model("User", UserSchema, "users");
