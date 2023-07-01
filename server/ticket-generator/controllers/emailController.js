const emailService = require("../services/emailService");

async function sendEmailWithAttachment(email, pdfBuffer) {
  try {
    await emailService.sendEmailWithAttachment(email, pdfBuffer);
    console.log("Email sent successfully!");
  } catch (error) {
    throw new Error("Error sending email");
  }
}

module.exports = { sendEmailWithAttachment };
