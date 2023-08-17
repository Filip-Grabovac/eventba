const mongoose = require('mongoose');
const concertSchema = require('../../models/Concert');
const connectDB = require('../../db/connect');

// Step 1: Function to extract values and update "concertHistory" attribute
async function extractConcertHistory(concert) {
  const previous_sold_amount = concert.previous_sold_amount;
  const currentSoldAmount = concert.tickets.sold_amount;
  const ticketsSoldToday = currentSoldAmount - previous_sold_amount;

  const concertHistoryItem = {
    date: new Date(),
    sold_amount: currentSoldAmount,
    sold_amount_today: ticketsSoldToday,
    amount_inBam: concert.tickets.amount_inBAM,
    type: {},
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

// Step 2: Fetch all concerts from the collection
async function processConcerts() {
  try {
    const Concert = connectDB(process.env.DATABASE_URL).model(
      'Concert',
      concertSchema,
      'concerts'
    );
    const concerts = await Concert.find({});

    // Step 3: Iterate through fetched concerts and call the extraction function
    for (const concert of concerts) {
      await extractConcertHistory(concert);

      // Step 4: Save the updated concert document back to the database
      await concert.save();
    }

    console.log('Extraction and update completed successfully!');
  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    // Step 5: Close the database connection when done
    mongoose.disconnect();
  }
}

// Call the function to start the process
processConcerts();
