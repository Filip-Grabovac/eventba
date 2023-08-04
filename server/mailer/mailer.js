require("dotenv").config();
const nodemailer = require("nodemailer");

function sendMail(to, subject, message) {
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SENDING_MAIL,
      pass: process.env.SENDING_PASS,
    },
  });

  let details = {
    from: process.env.SENDING_MAIL,
    to: to,
    subject: subject,
    text: message,
  };

  mailTransporter.sendMail(details, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent");
    }
  });
}

module.exports = sendMail;

function sendMailWithHyperlink(
  to,
  subject,
  message,
  hyperlinkText,
  hyperlinkUrl
) {
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SENDING_MAIL,
      pass: process.env.SENDING_PASS,
    },
  });

  let details = {
    from: process.env.SENDING_MAIL,
    to: to,
    subject: subject,
    html: `
      <p>${message}</p>
      <p><a href="${hyperlinkUrl}">${hyperlinkText}</a></p>
    `,
  };

  mailTransporter.sendMail(details, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent");
    }
  });
}

module.exports = sendMailWithHyperlink;
