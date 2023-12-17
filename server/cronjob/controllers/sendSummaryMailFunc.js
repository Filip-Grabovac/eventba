const nodemailer = require("nodemailer");
require("dotenv").config();

function sendSummaryMail(
  to = "info@event.ba",
  eventSummary,
  totalSoldAmount,
  totalInBAM
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

  const sortedEvents = sortEvents(eventSummary);

  let htmlBody = `
    <h1>Pregled online prodaje</h1>
  `;

  for (const event of sortedEvents) {
    const {
      performer_name,
      formattedDate,
      categories,
      totalSoldAmount,
      totalInBAM,
    } = event;

    htmlBody += `
    <h2>${performer_name} - ${formattedDate}</h2>
    <table border="1">
      <tr>
        <th style="padding: 5px 10px;">Kategorija</th>
        <th style="padding: 5px 10px;">Količina</th>
        <th style="padding: 5px 10px;">BAM</th>
      </tr>
  `;

    for (const category in categories) {
      const { sold_amount, inBAM } = categories[category];

      htmlBody += `
      <tr>
        <td >${category}</td>
        <td style="text-align:center;">${sold_amount}</td>
        <td style="text-align:center;">${inBAM}</td>
      </tr>
    `;
    }

    htmlBody += `<tr>
      <td><strong>Ukupno</strong></td>
        <td style="text-align:center;"><strong>${totalSoldAmount}</strong></td>
      	<td style="text-align:center;"><strong>${totalInBAM}</td>
      </tr> `;

    htmlBody += `</table><br>`;
  }

  // Add total row for all events
  htmlBody += `
    <h2>Ukupno:</h2>
    <table border="1">
      <tr>
        <th style="padding: 5px 10px;">Količina</th>
        <th style="padding: 5px 10px;">BAM</th>
      </tr>
      <tr>
        <td style="text-align:center;">${totalSoldAmount}</td>
        <td style="text-align:center;">${totalInBAM}</td>
      </tr>
    </table>
  `;

  let details = {
    from: process.env.SENDING_MAIL,
    to: to,
    subject: `Pregled online prodaje za jučer`,
    html: htmlBody,
  };

  mailTransporter.sendMail(details, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent");
    }
  });
}

function sortEvents(eventSummary) {
  // Convert eventSummary object to array for sorting
  const eventArray = Object.values(eventSummary);

  // Sort events by performer_name and formattedDate
  eventArray.sort((a, b) => {
    const performerA = a.performer_name || ""; // Default to an empty string if performer_name is undefined
    const performerB = b.performer_name || "";

    const dateA = a.formattedDate ? new Date(a.formattedDate) : null;
    const dateB = b.formattedDate ? new Date(b.formattedDate) : null;

    if (!dateA && !dateB) {
      return 0; // If both dates are undefined, consider them equal
    }

    const performerComparison = performerA.localeCompare(performerB);
    if (performerComparison !== 0) {
      return performerComparison;
    }

    if (!dateA) {
      return 1; // If dateA is undefined, consider it greater
    }

    if (!dateB) {
      return -1; // If dateB is undefined, consider it greater
    }

    return dateA - dateB;
  });

  return eventArray;
}

module.exports = sendSummaryMail;
