const connectDB = require("../../db/connect");
const ConcertSchema = require("../../models/Concert");
const Helper = require("../../models/Helper");

const calculateHotEvents = async () => {
  try {
    // Initialize variables to hold the largest values
    let maxFreeSaleTotalAmount = 1;
    let maxFreeSaleSoldAmount = 1;
    let maxOnlineSaleTotalAmount = 1;
    let maxOnlineSaleSoldAmount = 1;

    // Get the current date
    const currentDate = new Date();
    const Concert = connectDB(process.env.DATABASE_URL).model(
      "Concert",
      ConcertSchema,
      "concerts"
    );
    // Find events where time_of_event is greater than or equal to the current date
    const hotEvents = await Concert.find({
      time_of_event: { $gte: currentDate },
    });

    // Iterate through the hotEvents and update the variables if larger values are found
    hotEvents.forEach((event) => {
      const freeSaleTotal =
        event.tickets.free_sale.total_amount_left +
        event.tickets.free_sale.sold_amount;
      const onlineSaleTotal =
        event.tickets.online_sale.total_amount_left +
        event.tickets.online_sale.sold_amount;

      if (freeSaleTotal > maxFreeSaleTotalAmount)
        maxFreeSaleTotalAmount = freeSaleTotal;

      if (event.tickets.free_sale.sold_amount > maxFreeSaleSoldAmount)
        maxFreeSaleSoldAmount = event.tickets.free_sale.sold_amount;

      if (onlineSaleTotal > maxOnlineSaleTotalAmount)
        maxOnlineSaleTotalAmount = onlineSaleTotal;

      if (event.tickets.online_sale.sold_amount > maxOnlineSaleSoldAmount)
        maxOnlineSaleSoldAmount = event.tickets.online_sale.sold_amount;
    });

    // Calculate ratings and sort the events
    const eventsWithRatings = hotEvents.map((event) => {
      let rating = 0;

      if (event.is_promoted_event) rating += 7.5;
      if (event.type.includes("suggested")) rating += 7.5;
      rating += event.sponsors.length;

      rating +=
        (event.tickets.free_sale.total_amount_left / maxFreeSaleTotalAmount) *
        15;
      rating +=
        (event.tickets.online_sale.total_amount_left /
          maxOnlineSaleTotalAmount) *
        15;
      rating +=
        (event.tickets.free_sale.sold_amount / maxFreeSaleSoldAmount) * 20;
      rating +=
        (event.tickets.online_sale.sold_amount / maxOnlineSaleSoldAmount) * 15;

      // Create a new object with only the desired attributes
      return {
        _id: event._id,
        poster: event.poster,
        time_of_event: event.time_of_event,
        performer_name: event.performer_name,
        place: event.place,
        rating: rating, // You can include the rating if needed
      };
    });

    // Sort events by rating in descending order
    eventsWithRatings.sort((a, b) => b.rating - a.rating);

    // Get the top 5 events
    const top5Events = eventsWithRatings.slice(0, 5);

    // Find the Helper document or create it if it doesn't exist
    await Helper.findOneAndUpdate(
      {}, // Query to find any Helper document
      { $set: { hot_events: top5Events } }, // Update with the new hot_events data
      { upsert: true, new: true } // Create the document if it doesn't exist and return the updated document
    );
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

module.exports = { calculateHotEvents };
