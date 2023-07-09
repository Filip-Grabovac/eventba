const express = require("express");
const path = require("path");
const mime = require("mime-types");
const { generateBarcode, generateQRCode } = require("./controllers/qr&barGen");
const { generatePdfAndSendEmail } = require("./controllers/generatePdf");

// Serve static files with the correct MIME type

async function generateTicketAndSendEmail({ ticketGenData, concertData }) {
  const ticketList = ticketGenData.ticketList;

  // Iterate over the ticketList array sequentially
  for (const ticket of ticketList) {
    const serialNumber = ticket.id;
    const email = ticket.email;
    const price = ticket.price;
    const name = ticket.name || "";
    const lname = ticket.lname || "";
    const place = `
      ${concertData.place.place}, ${concertData.place.city}, ${concertData.place.country};`;
    const posterRoutePortrait = `event-images/${concertData.poster.portrait}`;
    const posterRouteLandscape = `event-images/${concertData.poster.landscape}`;
    const eventDate = new Date(concertData.time_of_event);
    const formattedDate = eventDate.toLocaleString("hr-HR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "Europe/Zagreb",
    });

    // Generate barcode and QR code for the current ticket
    await generateBarcode("N" + serialNumber);

    await generateQRCode("N" + serialNumber);
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
        place,
        price,
        name,
        lname,
        formattedDate,
        concertData,
        posterRoutePortrait,
        posterRouteLandscape,
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

// Call the function to generate barcode and QR code

module.exports = { generateTicketAndSendEmail };
