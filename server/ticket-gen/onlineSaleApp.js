const express = require("express");
const path = require("path");
const mime = require("mime-types");
const { generateQRCode } = require("./controllers/qr&barGen");
const { generatePdfAndSendEmail } = require("./controllers/generatePdf");
const connectDB = require("../db/connect");
const TicketSchema = require("../models/Ticket");
const { updateTicketAmount } = require("../controllers/concCheckandUpdate");

async function generateTicketAndSendEmail({ ticketGenData, concertData }) {
  const ticketList = ticketGenData.ticketList;

  // Iterate over the ticketList array sequentially
  const ticketsArray = Array.isArray(ticketList) ? ticketList : [ticketList];
  for (const ticket of ticketsArray) {
    // Extract ticket data
    const { email, price, name, lname, category, row, seat, ticketName } =
      ticket;

    const sponsors = concertData.sponsors.map(
      (sponsor) => `sponsors/${sponsor}`
    );
    const date = new Date(concertData.time_of_event).toLocaleString("hr-HR", {
      weekday: "long", // Adds the name of the day
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "Europe/Zagreb",
    });
    const formattedDate = date.charAt(0).toUpperCase() + date.slice(1);

    const ticketNumber = await updateTicketAmount(concertData._id, price);

    // Create a new ticket document
    const ticketData = {
      concert: concertData._id,
      performer_name: concertData.performer_name,
      category, // Set the category dynamically
      seat,
      row,
      price, // Set the price dynamically
      ticketName, // Set the ticket name dynamically
      owner: name + " " + lname,
      sent_on_email: email,
      isValid: true,
    };

    // Create a new ticket document with the concert ID
    const Ticket = connectDB(process.env.DATABASE_URL_TICKET).model(
      "Ticket",
      TicketSchema,
      `tickets_for_${concertData._id}`
    );

    const savedTicket = await new Ticket(ticketData).save();
    const serialNumber = savedTicket._id; // Retrieve the ticket's _id

    // Generate QR code for the current ticket

    await generateQRCode(String(serialNumber));

    const port = 3333;

    // Create a new Express app instance for the current ticket
    const app = express();

    // Serve static files with the correct MIME type
    app.use(
      express.static(path.join(__dirname, "public"), {
        setHeaders: (res, filePath) => {
          const contentType = mime.lookup(filePath);
          if (contentType === "text/css") {
            res.setHeader("Content-Type", contentType);
          }
        },
      })
    );

    // Set the view engine to EJS
    app.set("view engine", "ejs");

    // Set the views directory
    app.set("views", path.join(__dirname, "template"));

    // Define a route for the root URL ("/")
    app.get("/", (req, res) => {
      // Render the "index.ejs" file as the response
      res.render("onlineSale", {
        serialNumber,
        place: `
      ${concertData.place.place}, ${concertData.place.city}, ${concertData.place.country}`,
        price,
        name,
        lname,
        category,
        seat,
        row,
        ticketName,
        formattedDate,
        concertData,
        posterRoutePortrait: `event-images/${concertData.poster.portrait}`,
        posterRouteLandscape: `event-images/${concertData.poster.landscape}`,
        sponsors,
        ticketNumber,
      });
    });
    console.log(`Working on ${serialNumber} ${concertData.performer_name}`);
    // Start the server for the current ticket
    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    // Generate and send PDF email for the current ticket
    await generatePdfAndSendEmail(email, port);
    console.log("ended");
    // Close the server for the current ticket
    server.close();
  }
}

module.exports = { generateTicketAndSendEmail };

//
// if (ticketRows && Object.keys(ticketRows).length > 0) {
//   for (const rowName in ticketRows) {
//     if (ticketRows.hasOwnProperty(rowName)) {
//       const row = ticketRows[rowName];
//       const totalSeats = parseInt(row.total_seats);
//       const seatsInBatch = Math.min(batchCount, totalSeats);

//       const batchSize = 4;
//       for (let i = 1; i <= seatsInBatch; i += batchSize) {
//         // Create a batch of tickets (up to 4 tickets in a batch)
//         for (let j = i; j < i + batchSize && j <= seatsInBatch; j++) {
//           console.log(row, j);

//           const ticketDocument = {
//             concert: concertData._id,
//             performer_name: concertData.performer_name,
//             category: ticketType, // Set the category dynamically
//             price: ticketPrice, // Set the price dynamically
//             ticketName: categoryName, // Set the ticket name dynamically
//             row: rowName, // Assign the row name
//             seat: i, // Assign the seat number in order
//             isValid: true,
//           };

//           const Ticket = connectDB(process.env.DATABASE_URL_TICKET).model(
//             "Ticket",
//             TicketSchema,
//             `tickets_for_${concertData._id}`
//           );
//           const savedTicket = await new Ticket(ticketDocument).save();
//           const serialNumber = savedTicket._id; // Retrieve the ticket's _id

//           // Generate QR code for the current ticket
//           const qrCodeName = `qr-code-${tickets.length + 1}.png`;
//           await generateQRCodeFree(String(serialNumber), qrCodeName);
//           const qrPath = `images/${qrCodeName}`;

//           tickets.push({
//             serialNumber,
//             qrPath,
//             ticketNumber,
//             rowName,
//             seat: i,
//           });
//           ticketNumber = (Number(ticketNumber) + 1).toString().padStart(6, "0");
//           ticketsInBatch++;

//           if (ticketsInBatch === 4) {
//             // If 4 tickets have been generated in the current batch, generate the PDF and reset the counter
//             await generateAndSavePdf(port, tickets);
//             tickets = []; // Reset the batch
//             ticketsInBatch = 0; // Reset the counter
//           }
//           if (ticketsInBatch > 0) {
//             await generateAndSavePdf(port, tickets);
//             tickets = []; // Reset the batch
//             ticketsInBatch = 0; // Reset the counter
//           }
//         }
//       }
//     }
//   }
// }
