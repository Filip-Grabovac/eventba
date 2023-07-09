const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendEmailWithAttachment(email, ticket) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SENDING_MAIL,
        pass: process.env.SENDING_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SENDING_MAIL,
      to: email,
      subject: "Event.ba Ticket",
      text: "Your ticket is attached.",
      attachments: [
        {
          filename: "ticket.pdf",
          content: ticket,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    throw new Error("Error sending email");
  }
}

module.exports = { sendEmailWithAttachment };
