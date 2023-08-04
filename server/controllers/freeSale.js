const { generateFreeSaleTicket } = require("../ticket-gen/freeSaleApp");
const path = require("path");
const sendMailWithHyperlink = require("../mailer/mailer");
const updateFreeSale = require("../functions/concert/updateFreeSale");

const getTickets = async (req, res) => {
  try {
    // Get the required data from the request body
    const { ticketGenData, concertData, email } = req.body;

    // Generate the current date at the start of the ticket generation process
    const currentDate = new Date();
    const fileDate = currentDate.getTime();
    // Call the ticket generation function and pass the required data along with the formatted date
    await updateFreeSale(concertData._id, ticketGenData);
    // await generateFreeSaleTicket({ ticketGenData, concertData, fileDate });

    // Get the path of the combined PDF file using the same formatted date
    // const pdfFilePath = path.resolve(
    //   __dirname,
    //   "..",
    //   "ticket-gen",
    //   "pdf-folder",
    //   `tickets_${fileDate}.pdf`
    // );

    // sendMailWithHyperlink(
    //   email,
    //   "Ulaznice za slobodnu prodaju",
    //   `Preuzmite ulaznice na linku: `,
    //   "Ulaznice",
    //   `${process.env.REACT_APP_API_URL}/api/v1/freeSale/download-tickets?pdfFilePath=${pdfFilePath}`
    // );
    // Send the path of the combined PDF file in the response
    res.json({ fileDate });
  } catch (error) {
    console.log("Error generating and downloading tickets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const downloadTickets = async (req, res) => {
  const pdfFilePath = req.query.pdfFilePath;

  // Ensure the pdfFilePath is provided in the query parameter
  if (!pdfFilePath) {
    return res.status(400).json({ error: "pdfFilePath is required" });
  }

  // Set the appropriate content type for the response
  res.setHeader("Content-Type", "application/pdf");

  // Send the file to the client for download
  res.download(pdfFilePath, path.basename(pdfFilePath), (err) => {
    if (err) {
      console.log("Error while downloading the PDF:", err);
      return res.status(500).json({ error: "Error while downloading the PDF" });
    }
  });
};

module.exports = { getTickets, downloadTickets };