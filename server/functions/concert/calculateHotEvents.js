const Helper = require('../../models/Helper');

const calculateHotEvents = async (req, res, Concert) => {
  try {
    // Initialize variables to hold the largest values
    let maxFreeSaleTotalAmount = 0;
    let maxFreeSaleSoldAmount = 0;
    let maxOnlineSaleTotalAmount = 0;
    let maxOnlineSaleSoldAmount = 0;

    // Get the current date
    const currentDate = new Date();

    // Find events where time_of_event is greater than or equal to the current date
    const hotEvents = await Concert.find({
      time_of_event: { $gte: currentDate },
    });

    // Iterate through the hotEvents and update the variables if larger values are found
    hotEvents.forEach((event) => {
      const freeSaleTotal =
        event.tickets.free_sale.total_amount +
        event.tickets.free_sale.sold_amount;
      const onlineSaleTotal =
        event.tickets.online_sale.total_amount +
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
      if (event.type.includes('suggested')) rating += 7.5;
      rating += event.sponsors.length;

      rating +=
        (event.tickets.free_sale.total_amount / maxFreeSaleTotalAmount) * 15;
      rating +=
        (event.tickets.online_sale.total_amount / maxOnlineSaleTotalAmount) *
        15;
      rating +=
        (event.tickets.free_sale.sold_amount / maxFreeSaleSoldAmount) * 25;
      rating +=
        (event.tickets.online_sale.sold_amount / maxOnlineSaleSoldAmount) *
        25 *
        0.25;

      return { event };
    });

    // Sort events by rating in descending order
    eventsWithRatings.sort((a, b) => b.rating - a.rating);
    // Get the top 5 events
    const top5Events = eventsWithRatings.slice(0, 5);

    await Helper.findByIdAndUpdate(
      '64e7c5f97400f2436bb1cf47',
      { $set: { hot_events: top5Events } },
      { new: true } // Return the updated document
    );

    // Now you have the top 5 events with their ratings
    res.json(top5Events); // Send the top 5 events as a JSON response
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ message: 'An error occurred.' }); // Handle the error and send an error response
  }
};

module.exports = { calculateHotEvents };
