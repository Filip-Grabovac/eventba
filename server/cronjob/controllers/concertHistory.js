const mongoose = require("mongoose");
const concertSchema = require("../../models/Concert");
const connectDB = require("../../db/connect");

// Step 1: Function to extract values and update "concertHistory" attribute
async function extractConcertHistory(concert) {
  const previous_sold_amount = concert.previous_sold_amount;
  const currentSoldAmount = concert.tickets.sold_amount;
  const ticketsSoldToday = currentSoldAmount - previous_sold_amount;

  const concertHistoryItem = {
    date: currentDate,
    tickets: concert.tickets,
  };

  for (const category of Object.keys(concert.tickets.online_sale.type)) {
    const categoryData = concert.tickets.online_sale.type[category];
    const soldAmount = categoryData.max_amount - categoryData.amount;
    const soldAmountInBam = soldAmount * categoryData.price;
    concertHistoryItem.type[category] = {
      soldAmount,
      soldAmountInBam,
    };
  }

  concert.concert_history.push(concertHistoryItem);
  concert.previous_sold_amount = currentSoldAmount; // Update the previous_sold_amount for the next day
}

// Step 2: Fetch all concerts from the collection and process
async function processConcerts() {
  try {
    const Concert = connectDB(process.env.DATABASE_URL).model(
      "Concert",
      concertSchema,
      "concerts"
    );
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
