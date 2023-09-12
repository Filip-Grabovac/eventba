const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendEmailWithAttachment(email, ticket, dataForEmail) {
  const { name, lname, price, category, performerName } = dataForEmail;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SENDING_MAIL_TICKETS,
        pass: process.env.SENDING_PASS_TICKETS,
      },
    });
    const transporterInvent = nodemailer.createTransport({
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
      from: process.env.SENDING_MAIL_TICKETS,
      to: email,
      subject: "Event.ba - ulaznica",
      html: `
    <html>
  <body style="font-size: 18px;">
    <p style="font-size: 24px;"><strong>Poštovani ${
      name ? name : ""
    }</strong>,</p>
    <p>Uspješno ste kupili ulaznicu za ${performerName}!</p>
    <p>Vaša ulaznica se nalazi u privitku.</p>
    
  
    <p>O korištenju ulaznice:</p>
    <ul>
      <li>Ova ulaznica je jedinstvena i ne postoji druga kopija.</li>
      <li>Ulaznicu možete prikazati putem mobilnog uređaja u elektronskom obliku ili je isprintati na laserskom pisaču.</li>
      <li>Obratiti pozornost da je QR kod jednostavan i čitljiv prilkom skeniranja na ulazu. U suprotnom ulaz neće biti moguć.</li>
      <li>Molimo vas da pažljivo čuvate ovu ulaznicu kako biste je mogli iskoristiti pri ulazu na događaj.</li>
    </ul>
     <p>Želimo Vam ugodno iskustvo i lijep pozdarav,</p>
<table>
  <tr>
    <td style="font-size: 24px;"><strong>Vaš event.ba tim!</strong></td>
    <td><img src="https://event.ba:5000/static/images/Logo.png" alt="Event Logo" width="50" height="50"></td>
  </tr>
</table>
  </body>
</html>
  `,
      attachments: [
        {
          filename: `Ulaznica_za_${performerName}.pdf`, // The name of the attachment
          content: ticket, // The content of the attachment
        },
      ],
    };

    const mailForInvent = {
      from: process.env.SENDING_MAIL,
      to: "13kreso@gmail.com",
      // info@invent.ba
      subject: "Event.ba nova ulaznica",
      text: `Ulaznicu je kupio ${name ? name : "Kupac"} ${
        lname ? lname : ""
      } za ${performerName}, cijena: ${price} - kategorija: ${category}`,
    };
    await transporter.sendMail(mailOptions);
    await transporterInvent.sendMail(mailForInvent);

    console.log("Email sent successfully!");
  } catch (error) {
    throw new Error("Error sending email");
  }
}

module.exports = { sendEmailWithAttachment };
