const mongoose = require("mongoose");
const concertSchema = require("../../models/Concert");
const connectDB = require("../../db/connect");

// Step 1: Function to add tickets to concert history
async function addTicketsToConcertHistory(concert) {
  const currentDate = new Date();

  const concertHistoryItem = {
    date: currentDate,
    tickets: concert.tickets,
  };

  if (!concert.concertHistory) {
    concert.concert_history = [];
  }

  concert.concertHistory.push(concertHistoryItem);
}

// Step 2: Fetch all concerts from the collection and process
async function processConcerts() {
  try {
    const Concert = connectDB(
      "mongodb://eventba:AqpRhnhu7DA4M8nYDVLIqIDdtbFFewSkIdedmr8fzdkpEZqKje@185.99.2.232:27017/eventba?authSource=admin"
    ).model("Concert", concertSchema, "concerts");
    const concerts = await Concert.find({});

    // Iterate through fetched concerts and call the extraction function
    for (const concert of concerts) {
      await addTicketsToConcertHistory(concert);

      // Update the concert document using updateOne
      await Concert.updateOne({ _id: concert._id }, { $set: concert });
    }

    console.log("Extraction and update completed successfully!");
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    // Close the database connection when done
    mongoose.disconnect();
  }
}

// Call the function to start the process
processConcerts();
