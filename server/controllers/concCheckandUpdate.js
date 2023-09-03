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
        concert.tickets.online_sale.total_amount_left -= 1;

        const ticketNumber = await Number(
          concert.tickets.online_sale.sold_amount +
            concert.tickets.free_sale.total_amount_left +
            concert.tickets.free_sale.sold_amount
        )
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

    const concertZones = concert.tickets.online_sale.zones;

    const concertType = concert.place.type;

    // Ensure ticketList is an array, even for a single ticket
    const ticketsArray = Array.isArray(ticketList) ? ticketList : [ticketList];

    // Check if the concert document exists
    if (concert) {
      for (const ticket of ticketsArray) {
        const { category, seat, row } = ticket;

        if (concertZones.hasOwnProperty(category)) {
          if (concertZones[category].amount !== 0) {
            // Check if the seat exists in the row
            concertZones[category].amount -= 1;
            if (concertType !== "hall")
              if (
                concertZones[category].rows[row] &&
                concertZones[category].rows[row].seats.includes(seat)
              ) {
                // Filter the seat from the row if it's not a "hall" type concert

                concertZones[category].rows[row].seats = concertZones[
                  category
                ].rows[row].seats.filter((seats) => seats !== seat);
              } else {
                // Seat does not exist in the row, log a message in Croatian
                console.error("Sjedalo ne postoji u toj zoni ili redu.");
              }
          } else {
            console.error(`Ulaznica zone ${category} nije dostupna.`);
          }
        } else {
          console.error(`Ulaznica ${ticket.id} ima nedostupnu zonu.`);
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
