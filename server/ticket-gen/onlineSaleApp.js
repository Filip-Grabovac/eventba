const express = require("express");
const path = require("path");
const mime = require("mime-types");
const { generateQRCode } = require("./controllers/qr&barGen");
const { generatePdfAndSendEmail } = require("./controllers/generatePdf");
const connectDB = require("../db/connect");
const TicketSchema = require("../models/Ticket");
const { updateTicketAmount } = require("../controllers/concCheckandUpdate");
const { dailySales } = require("./dailySales");

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
      ticket_type: ticketName, // Set the ticket name dynamically
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
    const performerName = concertData.performer_name;
    const dataForEmail = { name, lname, price, category, performerName };
    // Generate and send PDF email for the current ticket

    let ticketInfo = {
      concert: concertData._id,
      performer_name: concertData.performer_name,
      date: concertData.time_of_event,
      zone: category,
      price,
    };

    await dailySales(ticketInfo);
    await generatePdfAndSendEmail(email, port, dataForEmail);
    console.log("Online ticket generation ended");
    // Close the server for the current ticket
    server.close();
  }
}

module.exports = { generateTicketAndSendEmail };
