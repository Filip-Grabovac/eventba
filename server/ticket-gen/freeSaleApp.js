const express = require("express");
const path = require("path");
const mime = require("mime-types");
const { generateQRCodeFree } = require("./controllers/qr&barGen");
const puppeteer = require("puppeteer");
const connectDB = require("../db/connect");
const TicketSchema = require("../models/Ticket");
const ejs = require("ejs");
const fs = require("fs").promises;
const { PDFDocument } = require("pdf-lib");

function generateRandomPort(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function generateFreeSaleTicket({
  ticketGenData,
  concertData,
  fileDate,
  ticketNumber,
}) {
  const tickets = [];
  const allPdfPaths = [];

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

  // Loop through the zones in ticketGenData
  for (const ticketData of ticketGenData) {
    const { categoryName, ticketType, ticketsNum, ticketPrice, ticketRows } =
      ticketData;
    const amount = parseInt(ticketsNum);
    let remainingTickets = amount;

    // Generate tickets in batches of 4 until all tickets are generated
    while (remainingTickets > 0) {
      tickets.length = 0;
      const batchCount = Math.min(4, remainingTickets);
      remainingTickets -= batchCount;

      for (let i = 0; i < batchCount; i++) {
        // Create a new ticket document
        const ticketDocument = {
          concert: concertData._id,
          performer_name: concertData.performer_name,
          category: ticketType, // Set the category dynamically
          price: ticketPrice, // Set the price dynamically
          ticketName: categoryName, // Set the ticket name dynamically
          isValid: true,
        };

        // Create a new ticket document with the concert ID
        const Ticket = connectDB(process.env.DATABASE_URL_TICKET).model(
          "Ticket",
          TicketSchema,
          `tickets_for_${concertData._id}`
        );
        const savedTicket = await new Ticket(ticketDocument).save();
        const serialNumber = savedTicket._id; // Retrieve the ticket's _id

        // Generate QR code for the current ticket
        const qrCodeName = `qr-code-${tickets.length + 1}.png`;
        await generateQRCodeFree(String(serialNumber), qrCodeName);
        const qrPath = `images/${qrCodeName}`;

        tickets.push({ serialNumber, qrPath, ticketNumber });
        ticketNumber = (Number(ticketNumber) + 1).toString().padStart(6, "0");
      }

      const port = 8888;

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
      app.get("/", async (req, res) => {
        try {
          // Render the "freeSale.ejs" file with the provided data
          const templatePath = path.join(__dirname, "template", "freeSale.ejs");

          const renderedHtml = await ejs.renderFile(templatePath, {
            place: `${concertData.place.place}, ${concertData.place.city}, ${concertData.place.country}`,
            ticketPrice,
            ticketType,
            categoryName,
            formattedDate,
            concertData,
            posterRoutePortrait: `event-images/${concertData.poster.portrait}`,
            posterRouteLandscape: `event-images/${concertData.poster.landscape}`,
            sponsors,
            ticketsNum,
            tickets,
          });
          // Send the rendered HTML as the response
          res.send(renderedHtml);
        } catch (error) {
          console.log("Error rendering EJS template:", error);
          res.status(500).send("Internal Server Error");
        }
      });

      // Start the server for the current ticket
      const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });

      // Download tickets
      const pdfBuffer = await generatePdf(port);

      console.log("Generation ended...Server closing");
      // Close the server for the current ticket
      server.close();
      const random = generateRandomPort(3000, 1000000);
      // Save the PDF buffer for this batch
      const pdfPath = path.resolve(
        __dirname,
        "pdf-folder",
        `batch_${random}.pdf`
      );
      await savePdfToFile(pdfBuffer, pdfPath);
      allPdfPaths.push(pdfPath);
    }
  }
  await mergePdfs({ pdfPaths: allPdfPaths, fileDate });

  console.log("All tickets generated and combined.");
}
// PDF GENERATOR
async function generatePdf(port) {
  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
      headless: "new",
    });
    const page = await browser.newPage();
    await page.goto(`http://localhost:${port}`, {
      waitUntil: "networkidle2",
    });

    await page.setViewport({ width: 800, height: 600 });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      quality: 50,
    });

    await browser.close();

    return pdfBuffer;
  } catch (error) {
    console.log("Error generating PDF:", error);
    return null; // Return null if there's an error, so we can handle it later
  }
}

// Function to save the generated PDF to a file
async function savePdfToFile(pdfBuffer, fileName) {
  try {
    const outputPath = path.resolve(__dirname, "pdf-folder", fileName);
    await fs.writeFile(outputPath, pdfBuffer);
    console.log(`${fileName} saved successfully`);
  } catch (error) {
    console.log("Error saving PDF:", error);
  }
}
// Function to merge all generated PDFs into a single combined PDF
async function mergePdfs({ pdfPaths, fileDate }) {
  try {
    const outputPdfPath = path.resolve(
      __dirname,
      "pdf-folder",
      `tickets_${fileDate}.pdf`
    );

    // Create a new PDFDocument
    const combinedPdf = await PDFDocument.create();

    // Loop through each PDF file path, read its contents, and add them to the combined PDF
    for (const pdfPath of pdfPaths) {
      const pdfBytes = await fs.readFile(pdfPath);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const copiedPages = await combinedPdf.copyPages(
        pdfDoc,
        pdfDoc.getPageIndices()
      );
      copiedPages.forEach((page) => {
        combinedPdf.addPage(page);
      });

      // Remove the batch PDF after it's copied to the combined PDF
      await fs.unlink(pdfPath);
    }

    // Save the combined PDF to the specified output path
    const combinedPdfBytes = await combinedPdf.save();
    await fs.writeFile(outputPdfPath, combinedPdfBytes);

    console.log("All PDFs merged into a single combined PDF.");
  } catch (error) {
    console.log("Error merging PDFs:", error);
  }
}

module.exports = { generateFreeSaleTicket };
