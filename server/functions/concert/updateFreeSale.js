const connectDB = require("../../db/connect");
const concertSchema = require("../../models/Concert");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

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
      console.log(
        concert.tickets.free_sale.total_amount,
        concert.tickets.online_sale.sold_amount,
        concert.tickets.free_sale.sold_amount
      );

      const ticketNumber = await Number(
        concert.tickets.free_sale.total_amount +
          concert.tickets.online_sale.sold_amount +
          1 +
          concert.tickets.free_sale.sold_amount
      )
        .toString()
        .padStart(6, "0");
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
          currentCategories[categoryName].max_amount += newTicketNum;
        } else {
          // If the category does not exist, create a new entry for it
          currentCategories[categoryName] = {
            amount: newTicketNum,
            max_amount: newTicketNum,
            price: parseInt(ticketPrice),
            name: ticketType,
            loaned: 0,
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
      return ticketNumber;
    } else {
      console.log("Concert not found.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Add resellers of freesale tickets
async function updateLoanTickets(ticketInputs, userData, concertId) {
  try {
    const Concert = connectDB(process.env.DATABASE_URL).model(
      "Concert",
      concertSchema,
      "concerts"
    );
    // Retrieve the concert document from the collection
    const concert = await Concert.findById(concertId);

    // Update the concert's free_sale.type object and total_loaned value
    for (const category in ticketInputs) {
      if (concert.tickets.free_sale.type[category]) {
        const categoryName = concert.tickets.free_sale.type[category].name;
        concert.tickets.free_sale.type[category].loaned += parseInt(
          ticketInputs[category]
        );
        concert.tickets.free_sale.total_loaned += parseInt(
          ticketInputs[category]
        );
      }
    }

    // Check if the resellers array exists, if not, create it
    if (!concert.tickets.free_sale.resellers) {
      concert.tickets.free_sale.resellers = [];
    }

    // Find if a reseller with the same name already exists in the array
    const existingResellerIndex = concert.tickets.free_sale.resellers.findIndex(
      (reseller) =>
        reseller.reseller_name === userData.reseller_info.sellingPlaceName
    );

    if (existingResellerIndex !== -1) {
      // If the reseller already exists, update the loaned amounts and handle new category
      for (const category in ticketInputs) {
        if (
          concert.tickets.free_sale.resellers[existingResellerIndex].type[
            category
          ]
        ) {
          concert.tickets.free_sale.resellers[existingResellerIndex].type[
            category
          ].loaned += parseInt(ticketInputs[category]);
        } else {
          const categoryName = concert.tickets.free_sale.type[category].name;
          concert.tickets.free_sale.resellers[existingResellerIndex].type[
            category
          ] = {
            loaned: parseInt(ticketInputs[category]),
            name: categoryName,
            price: parseInt(concert.tickets.free_sale.type[category].price),
            sold: 0,
          };
        }
      }
    } else {
      // If the reseller doesn't exist, push the new resellerTickets object
      const resellerTickets = {
        reseller_name: userData.reseller_info.sellingPlaceName,
        reseller_address: userData.reseller_info.sellingPlaceAddress,
        reseller_id: ObjectId(userData._id), // Convert _id to ObjectId
        type: {},
      };
      for (const category in ticketInputs) {
        if (concert.tickets.free_sale.type[category]) {
          const categoryName = concert.tickets.free_sale.type[category].name;
          resellerTickets.type[category] = {
            loaned: parseInt(ticketInputs[category]),
            name: categoryName,
            price: parseInt(concert.tickets.free_sale.type[category].price),
          };

          if (!resellerTickets.type[category].hasOwnProperty("sold")) {
            resellerTickets.type[category].sold = 0;
          }
        }
      }
      concert.tickets.free_sale.resellers.push(resellerTickets);
    }

    // Save the updated concert document
    await Concert.updateOne(
      { _id: concertId },
      {
        $set: {
          "tickets.free_sale.type": concert.tickets.free_sale.type,
          "tickets.free_sale.total_loaned":
            concert.tickets.free_sale.total_loaned,
          "tickets.free_sale.resellers": concert.tickets.free_sale.resellers,
        },
      }
    );

    console.log("Tickets successfully updated for the reseller.");
    return concert;
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

module.exports = { updateFreeSale, updateLoanTickets };
