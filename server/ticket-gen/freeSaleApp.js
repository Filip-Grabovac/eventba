const express = require("express");
const path = require("path");
const mime = require("mime-types");
const { generateQRCode } = require("./controllers/qr&barGen");
const puppeteer = require("puppeteer");
const connectDB = require("../db/connect");
const TicketSchema = require("../models/Ticket");
const PDFMerger = require("pdf-merger-js"); // Add the library for merging PDFs

async function generateFreeSaleTicket({ ticketGenData, concertData }) {
  const pdfBuffers = [];
  const sponsors = concertData.sponsors.map((sponsor) => `sponsors/${sponsor}`);
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

  // Loop through the categories in ticketGenData
  for (const category in ticketGenData) {
    if (ticketGenData.hasOwnProperty(category)) {
      const categoryData = ticketGenData[category];
      const { amount, price, name } = categoryData;

      // Loop to generate the specified number of tickets for the current category
      for (let i = 0; i < amount; i++) {
        // Create a new ticket document
        const ticketData = {
          concert: concertData._id,
          performer_name: concertData.performer_name,
          category: category, // Set the category dynamically
          price: price, // Set the price dynamically
          ticketName: name, // Set the ticket name dynamically
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
          res.render("freeSale.ejs", {
            serialNumber,
            place: `
      ${concertData.place.place}, ${concertData.place.city}, ${concertData.place.country};`,
            price,
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
        //Download tickets
        const generatePdf = async (port, serialNumber) => {
          try {
            const browser = await puppeteer.launch({
              args: ["--no-sandbox"],
              headless: "new",
            });
            const page = await browser.newPage();
            await page.goto(`http://localhost:${port}`, {
              waitUntil: "networkidle2",
            });

            // await page.setViewport({ width: 1680, height: 1050 });
            await page.setViewport({ width: 800, height: 600 });

            const pdfBuffer = await page.pdf({
              format: "A4",
              printBackground: true,
              quality: 50,
            });

            // Store the PDF buffer in the array
            pdfBuffers.push(pdfBuffer);

            await browser.close();
          } catch (error) {
            console.log("Error generating PDF and sending email:", error);
          }
        };

        console.log("ended");
        // Close the server for the current ticket
        server.close();
      }
    }
  }
  const merger = new PDFMerger();
  for (const pdfBuffer of pdfBuffers) {
    merger.addBuffer(pdfBuffer);
  }
  const mergedPdfBuffer = await merger.save();

  // Return the final merged PDF buffer
  return mergedPdfBuffer;
}

module.exports = { generateFreeSaleTicket };
