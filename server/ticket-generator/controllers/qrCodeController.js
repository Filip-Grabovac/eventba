const qrCodeService = require("../services/qrCodeService");

async function generateQRCode(data) {
  try {
    const qrCodeImage = await qrCodeService.generateQRCode(data);
    return qrCodeImage;
  } catch (error) {
    throw new Error("Error generating QR code");
  }
}

module.exports = { generateQRCode };
