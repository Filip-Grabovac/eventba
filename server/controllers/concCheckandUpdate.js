const concertSchema = require("../models/Concert");
const connectDB = require("../db/connect");

async function updateTicketAmount(concertId, price) {
  try {
    // Connect to the MongoDB database
    const Concert = connectDB(process.env.DATABASE_URL).model(
      "Concert",
      concertSchema,
      "concerts"
    );

    // Retrieve the concert document from the collection
    const concert = await Concert.findById(concertId);

    // Check if the concert document exists
    if (concert) {
      {
        concert.tickets.online_sale.sold_amount += 1;
        concert.tickets.online_sale.amount_inBAM += price;
        concert.tickets.online_sale.total_amount -= 1;

        const ticketNumber = await concert.tickets.sold_amount
          .toString()
          .padStart(6, "0");
        // Update the total amount

        // Save the updated concert document
        await Concert.updateOne({ _id: concertId }, concert);
        console.log("Values for SOLD and INBAM updated successfully.");
        return ticketNumber;
      }
    } else {
      console.log("Concert not found.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function updateCategoryAmount(concertId, ticketList) {
  try {
    const Concert = connectDB(process.env.DATABASE_URL).model(
      "Concert",
      concertSchema,
      "concerts"
    );
    // Retrieve the concert document from the collection
    const concert = await Concert.findById(concertId);

    // Ensure ticketList is an array, even for a single ticket
    const ticketsArray = Array.isArray(ticketList) ? ticketList : [ticketList];

    // Check if the concert document exists
    if (concert) {
      for (const ticket of ticketsArray) {
        const { category } = ticket;

        if (concert.tickets.online_sale.type.hasOwnProperty(category)) {
          if (concert.tickets.online_sale.type[category].amount !== 0) {
            concert.tickets.online_sale.type[category].amount -= 1;
          } else {
            console.error(`Ticket of category ${category} is unavailable.`);
          }
        } else {
          console.error(
            `Invalid category provided for ticket with ID ${ticket.id}.`
          );
        }
      }

      // Save the updated concert document
      await Concert.updateOne({ _id: concertId }, concert);

      console.log("Concert tickets updated successfully.");
    } else {
      console.log("Concert not found.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

module.exports = { updateTicketAmount, updateCategoryAmount };
