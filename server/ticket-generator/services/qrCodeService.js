const qrcode = require("qrcode");

async function generateQRCode(data) {
  try {
    const qrCodeImage = await qrcode.toDataURL(data);
    return qrCodeImage;
  } catch (error) {
    throw new Error("Error generating QR code");
  }
}

module.exports = { generateQRCode };
