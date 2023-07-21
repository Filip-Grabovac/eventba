const User = require("../../models/User");

async function updateUserBuyHistory(data) {
  const loggedinUserId = data.loggedinUser;
  const eventInfo = data.concertData;
  const tickets = data.ticketGenData.ticketList;

  const buyHistoryObj = {
    event: {
      performer: eventInfo.performer_name,
      time: eventInfo.time_of_event,
      location: eventInfo.place,
      pricesSum: data.ticketGenData.totalAmount,
      tickets: tickets,
      poster: eventInfo.poster,
      date: new Date(),
    },
  };

  try {
    // Find the user by ID
    const user = await User.findById(loggedinUserId);
    console.log(user);
    // If the user doesn't exist, return an error
    if (!user) {
      throw new Error(`Nema korisnika s ovim id-om: ${loggedinUserId}`);
    }

    // Update the buyHistory array by pushing the buyHistoryObj into it
    user.buyHistory.push(buyHistoryObj);

    // Save the updated user object
    await user.save();

    // Return the updated user object
    return user;
  } catch (error) {
    // Handle any errors that occur during the process
    throw new Error(error.message);
  }
}

module.exports = updateUserBuyHistory;
