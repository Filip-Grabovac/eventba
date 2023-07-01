const nodemailer = require("nodemailer");

function sendEmailWithAttachment(email, pdfBuffer) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "your-email-service",
      auth: {
        user: "your-email@example.com",
        pass: "your-email-password",
      },
    });

    const mailOptions = {
      from: "your-email@example.com",
      to: email,
      subject: "QR and Barcode Example",
      text: "Please find attached the QR and Barcode example",
      attachments: [
        {
          filename: "example.pdf",
          content: pdfBuffer,
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(new Error("Error sending email"));
      } else {
        resolve(info);
      }
    });
  });
}

module.exports = { sendEmailWithAttachment };
