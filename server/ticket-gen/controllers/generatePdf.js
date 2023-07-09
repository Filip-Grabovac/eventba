const puppeteer = require("puppeteer");
const { sendEmailWithAttachment } = require("./sendEmail");

const generatePdfAndSendEmail = async (email, port) => {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(`http://localhost:${port}`, {
      waitUntil: "networkidle2",
    });

    await page.setViewport({ width: 1680, height: 1050 });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });
    await browser.close();

    await sendEmailWithAttachment(email, pdfBuffer); // Use the provided email parameter instead of a hard-coded email
  } catch (error) {
    console.log("Error generating PDF and sending email:", error);
  }
};

module.exports = {
  generatePdfAndSendEmail,
};
