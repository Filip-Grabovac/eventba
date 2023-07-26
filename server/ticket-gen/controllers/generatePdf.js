const { sendEmailWithAttachment } = require("./sendEmail");
const puppeteer = require("puppeteer");

const generatePdfAndSendEmail = async (email, port) => {
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
    await browser.close();

    await sendEmailWithAttachment(email, pdfBuffer); // Use the provided email parameter if you have defined the sendEmailWithAttachment function
  } catch (error) {
    console.log("Error generating PDF and sending email:", error);
  }
};

module.exports = {
  generatePdfAndSendEmail,
};
