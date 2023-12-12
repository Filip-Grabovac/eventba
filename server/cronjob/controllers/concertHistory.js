const concertSchema = require("../../models/Concert");
const connectDB = require("../../db/connect");

// Step 1: Function to add tickets to concert history
async function addTicketsToConcertHistory(concert) {
  const currentDate = new Date();

  const todayOnlineSaleTickets = concert.tickets.online_sale?.zones || {};
  const yesterdayOnlineSaleTickets =
    concert.tickets_yesterday.online_sale?.zones || {};

  const todayFreeSaleResellers = concert.tickets.free_sale?.resellers || [];
  const yesterdayFreeSaleResellers =
    concert.tickets_yesterday.free_sale?.resellers || [];

  // Patch missing online sale categories in tickets_yesterday
  if (concert.tickets_yesterday.online_sale?.zones) {
    Object.keys(todayOnlineSaleTickets).forEach((category) => {
      if (!concert.tickets_yesterday.online_sale.zones[category]) {
        concert.tickets_yesterday.online_sale.zones[category] =
          todayOnlineSaleTickets[category];
      }
    });
  }

  // Patch missing free sale categories for each reseller in tickets_yesterday
  todayFreeSaleResellers.forEach((reseller, index) => {
    const existingReseller =
      concert.tickets_yesterday.free_sale.resellers[index];
    if (existingReseller) {
      Object.keys(reseller.zones).forEach((category) => {
        if (!existingReseller.zones[category]) {
          existingReseller.zones[category] = reseller.zones[category];
        }
      });
    }
  });

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
    Object.keys(reseller.zones).forEach((category) => {
      const todayCategoryData = reseller.zones[category];

      const yesterdayReseller = yesterdayFreeSaleResellers[index] || {
        zones: {},
      };
      const yesterdayCategoryData = yesterdayReseller.zones[category] || {
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
      zones: modifiedCategories,
    });
  });

  // Create an object for the concert history entry
  const concertHistoryItem = {
    date: currentDate,
    tickets: {
      online_sale: {
        zones: modifiedOnlineSaleTickets,
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
    const currentDate = new Date();
    const concerts = await Concert.find({
      time_of_event: { $gte: currentDate },
    });

    // Iterate through fetched concerts and call the extraction function
    for (const concert of concerts) {
      await addTicketsToConcertHistory(concert);

      await Concert.updateOne({ _id: concert._id }, { $set: concert });
    }

    console.log("Extraction and update completed successfully!");
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

module.exports = processConcerts;
