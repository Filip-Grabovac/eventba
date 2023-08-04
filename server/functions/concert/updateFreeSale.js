const connectDB = require("../../db/connect");
const concertSchema = require("../../models/Concert");

async function updateFreeSale(concertId, ticketList) {
  try {
    const Concert = connectDB(process.env.DATABASE_URL).model(
      "Concert",
      concertSchema,
      "concerts"
    );
    // Retrieve the concert document from the collection
    const concert = await Concert.findById(concertId);

    // Check if the concert document exists
    if (concert) {
      // Ensure ticketList is an array, even for a single ticket
      const ticketsArray = Array.isArray(ticketList)
        ? ticketList
        : [ticketList];

      // Calculate the current total amount and ticket numbers for each category
      let currentTotalAmount = concert.tickets.free_sale.total_amount || 0;
      let currentCategories = concert.tickets.free_sale.type || {};

      // Iterate through the ticketList and update the concert's tickets.free_sale.type accordingly
      for (const ticket of ticketsArray) {
        const { categoryName, ticketType, ticketsNum, ticketPrice } = ticket;
        console.log(ticketType);
        // Parse the new ticket number to integer
        const newTicketNum = parseInt(ticketsNum);

        // If the category already exists, add the new ticket number to the current value
        if (currentCategories.hasOwnProperty(categoryName)) {
          currentCategories[categoryName].amount += newTicketNum;
          currentCategories[categoryName].maxAmount += newTicketNum;
        } else {
          // If the category does not exist, create a new entry for it
          currentCategories[categoryName] = {
            amount: newTicketNum,
            maxAmount: newTicketNum,
            price: parseInt(ticketPrice),
            name: ticketType,
          };
        }

        // Add the new ticket number to the current total amount
        currentTotalAmount += newTicketNum;
      }

      // Update the concert document using updateOne()
      const updateResult = await Concert.updateOne(
        { _id: concertId },
        {
          $set: {
            "tickets.free_sale.total_amount": currentTotalAmount,
            "tickets.free_sale.type": currentCategories,
          },
        }
      );

      console.log("Update result:", updateResult);

      console.log("Concert tickets updated successfully.");
    } else {
      console.log("Concert not found.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

module.exports = updateFreeSale;
