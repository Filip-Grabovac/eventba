const qrCodeController = require("./src/controllers/qrCodeController");
const barcodeController = require("./src/controllers/barcodeController");
const emailController = require("./src/controllers/emailController");
const pdfService = require("./src/services/pdfService");
const fs = require("fs");
const ejs = require("ejs");

const templatePath = "./src/templates/template.html";

// Generate and send QR and Barcode
async function generateAndSendQRBarcode(email, data) {
  try {
    const qrCodeImage = await qrCodeController.generateQRCode(data);
    const barcodeImage = await barcodeController.generateBarcode(data);

    // Read the HTML template
    const template = fs.readFileSync(templatePath, "utf-8");

    // Replace placeholders in the template with actual values
    const htmlTemplate = ejs.render(template, { qrCodeImage, barcodeImage });

    const pdfBuffer = await pdfService.convertToPDF(htmlTemplate);
    await emailController.sendEmailWithAttachment(email, pdfBuffer);

    console.log("Email sent successfully!");
  } catch (error) {
    console.error(error);
  }
}

// Call the function with the email and data
const email = "recipient@example.com";
const data = "1234567890"; // The data for the QR code and barcode
generateAndSendQRBarcode(email, data);
