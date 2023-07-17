const Concert = require("../models/Concert");

async function checkAndUpdateAmount(concertId, category, price) {
  try {
    // Connect to the MongoDB database

    // Retrieve the concert document from the collection
    const concert = await Concert.findById(concertId);

    console.log(concert);
    // Check if the concert document exists
    if (concert) {
      // Check if the provided category exists in the concert document
      if (concert.tickets.type.hasOwnProperty(category)) {
        // Subtract 1 from the amount of the specified category
        if (concert.tickets.type[category].amount !== 0)
          concert.tickets.type[category].amount -= 1;
        else {
          console.error("Ticket unavailable");
        }
        concert.tickets.sold_amount = Number(concert.tickets.sold_amount) + 1;
        concert.tickets.amount_inBAM =
          Number(concert.tickets.amount_inBAM) + price;

        const ticketNumber = concert.tickets.sold_amount
          .toString()
          .padStart(7, "0");
        // Update the total amount
        concert.tickets.total_amount -= 1;

        // Save the updated concert document
        await Concert.updateOne({ _id: concertId }, concert);

        console.log("Values updated successfully.");
        return ticketNumber;
      } else {
        console.log("Invalid category provided.");
      }
    } else {
      console.log("Concert not found.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

module.exports = checkAndUpdateAmount;
