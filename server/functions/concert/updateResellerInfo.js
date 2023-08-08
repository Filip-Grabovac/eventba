const mongoose = require("mongoose");
const User = require("../../models/User");

async function updateResellerInfo(userData, concertId) {
  try {
    // Convert concertId to a valid ObjectId
    const validConcertId = mongoose.Types.ObjectId(concertId);

    const user = await User.findOneAndUpdate(
      { _id: userData._id }, // Find user by their _id field
      { $addToSet: { "reseller_info.concerts": validConcertId } }, // Add concertId as ObjectId to the concerts array if not already present
      { new: true } // Return the updated user document
    );

    if (user) {
      console.log("User updated successfully");
    } else {
      console.log("User not found");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

module.exports = updateResellerInfo;
