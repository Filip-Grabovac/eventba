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

  // Loop through the categories in ticketGenData
  for (const ticketData of ticketGenData) {
    const { categoryName, ticketType, ticketsNum, ticketPrice } = ticketData;
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
        const Ticket = connectDB(
          "mongodb://tickets:AqpRhnhu7DA4M8nYDVLIqIDdtbFFewSkIdedmr8fzdkpEZqKje@185.99.2.232:27017/tickets?authMechanism=DEFAULT"
        ).model("Ticket", TicketSchema, `tickets_for_${concertData._id}`);

        const savedTicket = await new Ticket(ticketDocument).save();
        const serialNumber = savedTicket._id; // Retrieve the ticket's _id

        // Generate QR code for the current ticket
        const qrCodeName = `qr-code-${tickets.length + 1}.png`;
        await generateQRCodeFree(String(serialNumber), qrCodeName);
        const qrPath = `images/${qrCodeName}`;

        tickets.push({ serialNumber, qrPath });
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
      app.get("/", async (req, res) => {
        try {
          // Render the "freeSale.ejs" file with the provided data
          const templatePath = path.join(__dirname, "template", "freeSale.ejs");

          const renderedHtml = await ejs.renderFile(templatePath, {
            place: `${concertData.place.place}, ${concertData.place.city}, ${concertData.place.country};`,
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

      console.log("ended");
      // Close the server for the current ticket
      server.close();

      // Save the PDF buffer for this batch

      const pdfPath = path.resolve(
        __dirname,
        "pdf-folder",
        `batch_${port}.pdf`
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

// const data = {
//   ticketGenData: [
//     {
//       categoryName: "Kategorija5",
//       ticketType: "Parter",
//       ticketsNum: "6",
//       ticketPrice: "10",
//     },
//     {
//       categoryName: "Kategorija1",
//       ticketType: "TRIBINA",
//       ticketsNum: "5",
//       ticketPrice: "30",
//     },
//   ],

//   concertData: {
//     poster: {
//       landscape: "1690145527916_653_landscape.jpg",
//       portrait: "1690145527916_686_portrait.jpg",
//     },
//     tickets: {
//       online_sale: {
//         total_amount: 1998,
//         sold_amount: 2,
//         amount_inBAM: 35,
//         type: {
//           "Kategorija 1": {
//             amount: 1500,
//             maxAmount: 1500,
//             price: 10,
//             name: "Parter",
//           },
//           "Kategorija 2": {
//             amount: 399,
//             maxAmount: 400,
//             price: 15,
//             name: "Tribina",
//           },
//           "Kategorija 3": {
//             amount: 99,
//             maxAmount: 100,
//             price: 20,
//             name: "VIP",
//           },
//         },
//       },
//       free_sale: {
//         total_amount: 1000,
//         total_loaned: 0,
//         sold_amount: 0,
//         resellers: {
//           reseller_id: "64abec44437ec5030c423547",
//           reseller_name: "Caffe Avatar",
//           transactions: [
//             {
//               reseeler_name: "Filip Konobarović",
//               organizer_name: "Anto Matić",
//               amount_inBAM: 40,
//               date: "2023-08-04T00:19:00.000Z",
//             },
//           ],
//           type: {
//             "Kategorija 1": {
//               amount: 50,
//               maxAmount: 100,
//               price: 10,
//               name: "Parter",
//             },
//             "Kategorija 2": {
//               amount: 30,
//               maxAmount: 40,
//               price: 15,
//               name: "Tribina",
//             },
//             "Kategorija 3": {
//               amount: 10,
//               maxAmount: 20,
//               price: 20,
//               name: "VIP",
//             },
//           },
//         },
//       },
//     },
//     place: {
//       type: "hall",
//       country: "Bosna i Hercegovina",
//       city: "Novi Travnik",
//       place: "Dvorana Novi Travnik",
//     },
//     type: ["other", "sport"],
//     sponsors: [
//       "13.png",
//       "12.png",
//       "11.png",

//       "5.png",
//       "3.png",
//       "7.png",
//       "8.png",
//       "9.png",
//     ],
//     is_promoted_event: false,
//     previousSoldAmount: 2,
//     _id: "64c7a6309de295da8de7dc4d",
//     performer_name: "Prljavo Kazalište",
//     time_of_event: "2023-08-08T00:19:00.000Z",
//     description: "Pokušaj uploada.",
//     organizer: "64abece5437ec5030c42354d",
//   },
// };