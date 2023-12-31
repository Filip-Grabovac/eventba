const { generateFreeSaleTicket } = require("../ticket-gen/freeSaleApp");
const path = require("path");
const sendMailWithHyperlink = require("../mailer/mailer");
const {
  updateFreeSale,
  updateLoanTickets,
} = require("../functions/concert/updateFreeSale");
const updateResellerInfo = require("../functions/concert/updateResellerInfo");
const addTransactionController = require("../functions/concert/addTransaction");
const verifyTransactionController = require("../functions/concert/verifyTransaction");

const getTickets = async (req, res) => {
  try {
    // Get the required data from the request body
    const { ticketGenData, concertData, adminEmail, adminName } = req.body;

    // Generate the current date at the start of the ticket generation process
    const currentDate = new Date();
    const fileDate = currentDate.getTime();

    // Call the ticket generation function and pass the required data along with the formatted date
    const ticketNumber = await updateFreeSale(
      concertData._id,
      ticketGenData,
      adminName
    );
    await generateFreeSaleTicket({
      ticketGenData,
      concertData,
      fileDate,
      ticketNumber,
    });

    // Get the path of the combined PDF file using the same formatted date
    const pdfFilePath = path.resolve(
      __dirname,
      "..",
      "ticket-gen",
      "pdf-folder",
      `tickets_${fileDate}.pdf`
    );

    sendMailWithHyperlink(
      adminEmail,
      "Ulaznice za slobodnu prodaju",
      `Preuzmite ulaznice za ${concertData.performer_name} na linku: `,
      "Ulaznice",
      `${process.env.REACT_APP_API_URL}/api/v1/freeSale/download-tickets?pdfFilePath=${pdfFilePath}`
    );
    // Send the path of the combined PDF file in the response
    res.json({ pdfFilePath });
  } catch (error) {
    console.log("Error generating and downloading tickets:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const downloadTickets = async (req, res) => {
  const pdfFilePath = req.query.pdfFilePath;

  // Ensure the pdfFilePath is provided in the query parameter
  if (!pdfFilePath) {
    return res.status(400).json({ message: "pdfFilePath is required" });
  }

  // Set the appropriate content type for the response
  res.setHeader("Content-Type", "application/pdf");

  // Send the file to the client for download
  res.download(pdfFilePath, path.basename(pdfFilePath), (err) => {
    if (err) {
      console.log("Error while downloading the PDF:", err);
      return res
        .status(500)
        .json({ message: "Error while downloading the PDF" });
    }
  });
};

const loanTickets = async (req, res) => {
  try {
    const { ticketInputs, userData, concertId } = req.body;
    const concert = await updateLoanTickets(ticketInputs, userData, concertId);

    await updateResellerInfo(userData, concertId);
    res
      .status(201)
      .json({ success: "Uspješano ste zadužili ulaznice!", concert });
  } catch (error) {
    console.log("Error generating and downloading tickets:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addTransaction = async (req, res) => {
  const { transactionData, resellerId, concertId } = req.body;
  try {
    addTransactionController(transactionData, resellerId, concertId);
    res.status(201).json({ success: "Uspješano ste dodali transkaciju!" });
  } catch (error) {
    console.log("Error generating and downloading tickets:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyTransaction = async (req, res) => {
  const { transactionIndex, concertId, resellerId } = req.body;
  try {
    await verifyTransactionController(transactionIndex, concertId, resellerId);
    res
      .status(201)
      .json({ success: "Uspješano ste verificirali transkaciju!" });
  } catch (error) {
    console.log("Error generating and downloading tickets:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getTickets,
  downloadTickets,
  loanTickets,
  addTransaction,
  verifyTransaction,
};
