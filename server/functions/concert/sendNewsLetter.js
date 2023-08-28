const sendMailWithHyperlink = require("../../mailer/mailer");
const Helper = require("../../models/Helper");

const sendNewsLetterMail = async (concert) => {
  const helperId = "64ec823175ccc834678f4698";
  const helper = await Helper.findById(helperId);
  const date = new Date(concert.time_of_event);
  const options = {
    month: "short", // Month (abbreviated)
    day: "numeric", // Day of the month
    year: "numeric", // Year
    hour: "numeric", // Hour
    minute: "numeric", // Minute
    timeZone: "Europe/Zagreb",
  };
  const formattedDateTime = date.toLocaleString("hr-HR", options);

  const emails = helper.newsletter;
  const content = `Upravo je najavljen ${concert.performer_name} u ${concert.place.city}, ${concert.place.place} u ${formattedDateTime}.`;

  for (const email of emails) {
    const to = email;
    const subject = "NewsLetter - event.ba"; // Add your subject
    const hyperlinkText = "Detaljnije pogledaj ovdje"; // Add your hyperlink text
    const hyperlinkUrl = `${process.env.REACT_APP_API_URL_FE}/single?id=${concert._id}`; // Add your hyperlink URL

    sendMailWithHyperlink(to, subject, content, hyperlinkText, hyperlinkUrl);
  }
};

module.exports = sendNewsLetterMail;
