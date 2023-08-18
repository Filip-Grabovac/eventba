const mongoose = require("mongoose");
const concertSchema = require("../../models/Concert");
const connectDB = require("../../db/connect");

// Step 1: Function to add tickets to concert history
async function addTicketsToConcertHistory(concert) {
  const currentDate = new Date();
  const todayOnlineSaleTickets = concert.tickets.online_sale.type;
  const yesterdayOnlineSaleTickets = concert.tickets_yesterday.online_sale.type;

  const todayFreeSaleResellers = concert.tickets.free_sale.resellers;
  const yesterdayFreeSaleResellers =
    concert.tickets_yesterday.free_sale.resellers;

  if (!concert.concert_history) {
    concert.concert_history = [];
  }

  // Create an object to hold the modified online sale tickets data
  const modifiedOnlineSaleTickets = {};
  // Create an array to hold the modified free sale resellers data
  const modifiedFreeSaleResellers = [];

  // Iterate through online_sale type categories
  Object.keys(todayOnlineSaleTickets).forEach((category) => {
    const todayCategoryData = todayOnlineSaleTickets[category];
    const yesterdayCategoryData = yesterdayOnlineSaleTickets[category] || {
      sold_amount: 0,
    };

    const soldAmountForDay =
      Number(todayCategoryData.max_amount - todayCategoryData.amount) -
      Number(yesterdayCategoryData.max_amount - yesterdayCategoryData.amount);
    modifiedOnlineSaleTickets[category] = {
      name: todayCategoryData.name,
      sold_amount: soldAmountForDay,
      price: todayCategoryData.price,
    };
  });

  // Iterate through free_sale resellers
  todayFreeSaleResellers.forEach((reseller, index) => {
    const modifiedCategories = {};

    // Iterate through category types for the reseller
    Object.keys(reseller.type).forEach((category) => {
      const todayCategoryData = reseller.type[category];

      const yesterdayReseller = yesterdayFreeSaleResellers[index] || {
        type: {},
      };
      const yesterdayCategoryData = yesterdayReseller.type[category] || {
        sold: 0,
      };

      const soldAmountForDay =
        todayCategoryData.sold - yesterdayCategoryData.sold;

      modifiedCategories[category] = {
        name: todayCategoryData.name,
        sold_amount: soldAmountForDay,
        price: todayCategoryData.price,
      };
    });

    modifiedFreeSaleResellers.push({
      reseller_name: reseller.reseller_name,
      types: modifiedCategories,
    });
  });

  // Create an object for the concert history entry
  const concertHistoryItem = {
    date: currentDate,
    tickets: {
      online_sale: {
        types: modifiedOnlineSaleTickets,
      },
      free_sale: {
        resellers: modifiedFreeSaleResellers,
      },
    },
  };

  // Push the new entry to the concert's concert_history array
  concert.concert_history.push(concertHistoryItem);
  concert.tickets_yesterday = JSON.parse(JSON.stringify(concert.tickets));
}

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
processConcerts();
