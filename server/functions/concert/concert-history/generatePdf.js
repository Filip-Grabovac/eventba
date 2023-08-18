const puppeteer = require("puppeteer");
const ejs = require("ejs");
const fs = require("fs");
const generatePdf = async (data) => {
  try {
    console.log("Starting puppeteer");
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
      headless: "new", // Changed to true for PDF generation
    });
    const page = await browser.newPage();
    await page.setCacheEnabled(false);

    // Load and inline the logo image
    const logoImage = fs.readFileSync(
      __dirname + "/public/images/Logo.png",
      "base64"
    );
    const logoImageSrc = `data:image/png;base64,${logoImage}`;

    // Render the EJS template using the provided data
    const htmlContent = await renderEjsTemplate(data, logoImageSrc);
    await page.setContent(htmlContent);

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      quality: 50,
    });
    console.log("Created pdf");

    await browser.close();
    return pdfBuffer;
  } catch (error) {
    console.log("Error generating PDF:", error);
    throw error;
  }
};

// Function to render the EJS template
const renderEjsTemplate = async (data, logoImageSrc) => {
  try {
    // Load and render the EJS template
    const templatePath = __dirname + "/views/eventHistory.ejs";
    const templateContent = await ejs.renderFile(templatePath, {
      data,
      logoImageSrc,
    });
    return templateContent;
  } catch (error) {
    console.log("Error rendering EJS template:", error);
    throw error;
  }
};

module.exports = generatePdf;
