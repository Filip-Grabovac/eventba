const express = require("express");
const path = require("path");
const mime = require("mime-types");
const { generateQRCode } = require("./controllers/qr&barGen");
const { generatePdfAndSendEmail } = require("./controllers/generatePdf");
const connectDB = require("../db/connect");
const TicketSchema = require("../models/Ticket");
const checkAndUpdateAmount = require("../controllers/concCheckandUpdate");
// Serve static files with the correct MIME type

async function generateTicketAndSendEmail({ ticketGenData, concertData }) {
  const ticketList = ticketGenData.ticketList;

  // Iterate over the ticketList array sequentially
  for (const ticket of ticketList) {
    // Extract ticket data
    const { email, price, name, lname, category, ticketName } = ticket;

    const sponsors = concertData.sponsors.map(
      (sponsor) => `sponsors/${sponsor}`
    );

    const formattedDate = new Date(concertData.time_of_event).toLocaleString(
      "hr-HR",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: "Europe/Zagreb",
      }
    );

    const ticketNumber = await checkAndUpdateAmount(
      concertData._id,
      category,
      price
    );

    // Create a new ticket document
    const ticketData = {
      concert: concertData._id,
      performer_name: concertData.performer_name,
      category: category, // Set the category dynamically
      price: price, // Set the price dynamically
      ticketName: ticketName, // Set the ticket name dynamically
      owner: name + " " + lname,
      sentOnEmail: email,
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

    function generateRandomPort(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const port = generateRandomPort(3000, 60000);

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
      res.render("index", {
        serialNumber,
        place: `
      ${concertData.place.place}, ${concertData.place.city}, ${concertData.place.country};`,
        price,
        name,
        lname,
        category,
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
