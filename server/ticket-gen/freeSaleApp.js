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

async function generateTicketDocument(
  concertData,
  categoryName,
  ticketType,
  ticketPrice,
  seat,
  row
) {
  // Create a new ticket document
  const ticketDocument = {
    concert: concertData._id,
    performer_name: concertData.performer_name,
    category: ticketType,
    price: ticketPrice,
    ticket_type: categoryName,
    isValid: true,
    seat,
    row,
  };

  // Create a new ticket document with the concert ID
  const Ticket = connectDB(process.env.DATABASE_URL_TICKET).model(
    "Ticket",
    TicketSchema,
    `tickets_for_${concertData._id}`
  );
  const savedTicket = await new Ticket(ticketDocument).save();
  return savedTicket._id;
}

function createExpressApp() {
  const app = express();

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

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "template"));

  return app;
}

async function generateHtmlTemplate(templatePath, data) {
  try {
    const renderedHtml = await ejs.renderFile(templatePath, data);
    return renderedHtml;
  } catch (error) {
    console.log("Error rendering EJS template:", error);
    throw error;
  }
}

function startExpressServer(app, port) {
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      resolve(server);
    });
  });
}

async function generateAndSavePdf(port) {
  const pdfBuffer = await generatePdf(port);
  const random = generateRandomPort(3000, 1000000);
  const pdfPath = path.resolve(__dirname, "pdf-folder", `batch_${random}.pdf`);
  await savePdfToFile(pdfBuffer, pdfPath);
  return pdfPath;
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
  const formattedDate = new Date(concertData.time_of_event).toLocaleString(
    "hr-HR",
    {
      weekday: "long",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "Europe/Zagreb",
    }
  );

  for (const ticketData of ticketGenData) {
    const { categoryName, ticketType, ticketsNum, ticketPrice, rows } =
      ticketData;

    // Create the Express server once outside the loops
    const port = 8888;
    const app = createExpressApp();

    app.get("/", async (req, res) => {
      const templatePath = path.join(__dirname, "template", "freeSale.ejs");
      const renderedHtml = await generateHtmlTemplate(templatePath, {
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
      res.send(renderedHtml);
    });

    if (rows) {
      // Iterate through each row
      for (const rowName in rows) {
        const row = rowName;
        const totalSeats = parseInt(rows[rowName].total_seats);

        // Generate tickets for each seat in the row

        for (let seatNumber = 1; seatNumber <= totalSeats; seatNumber++) {
          const serialNumber = await generateTicketDocument(
            concertData,
            ticketType,
            ticketPrice,
            seatNumber,
            row
          );
          console.log(`Row: ${row}, Seat: ${seatNumber}`);

          const qrCodeName = `qr-code-${tickets.length + 1}.png`;
          await generateQRCodeFree(String(serialNumber), qrCodeName);
          const qrPath = `images/${qrCodeName}`;

          tickets.push({ serialNumber, qrPath, ticketNumber, seatNumber, row });
          ticketNumber = (Number(ticketNumber) + 1).toString().padStart(6, "0");

          if (tickets.length === 4 || seatNumber === totalSeats) {
            const server = await startExpressServer(app, port);

            // Generate and save the PDF for all tickets
            const pdfPath = await generateAndSavePdf(port);
            allPdfPaths.push(pdfPath);

            // Close the server after generating all tickets
            server.close();

            tickets.length = 0;
          }
        }
      }
    } else {
      const totalTickets = parseInt(ticketsNum);
      for (let i = 1; i <= totalTickets; i++) {
        const serialNumber = await generateTicketDocument(
          concertData,
          ticketType,
          ticketPrice
        );

        const qrCodeName = `qr-code-${tickets.length + 1}.png`;
        await generateQRCodeFree(String(serialNumber), qrCodeName);
        const qrPath = `images/${qrCodeName}`;

        tickets.push({ serialNumber, qrPath, ticketNumber });
        ticketNumber = (Number(ticketNumber) + 1).toString().padStart(6, "0");

        console.log(i, totalTickets);
        if (tickets.length === 4 || i === totalTickets) {
          const server = await startExpressServer(app, port);

          // Generate and save the PDF for all tickets
          const pdfPath = await generateAndSavePdf(port);
          allPdfPaths.push(pdfPath);

          // Close the server after generating all tickets
          server.close();

          tickets.length = 0;
        }
      }
    }

    // Start the Express server once
  }

  await mergePdfs({ pdfPaths: allPdfPaths, fileDate });
  console.log("All tickets generated and combined.");
}

function formatConcertDate(date) {
  return;
}

function generateRandomPort(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
