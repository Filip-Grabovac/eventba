const qrcode = require("qrcode");
const path = require("path");

async function generateQRCode(qrCodeValue) {
  const imagePathQr = path.join(
    __dirname,
    "..",
    "public",
    "images",
    "qrCode.png"
  );
  try {
    const options = {
      width: 75, // QR code width
      errorCorrectionLevel: "H", // Error correction level
    };

    const qrCodeImage = await qrcode.toFile(imagePathQr, qrCodeValue, options);
    return qrCodeImage;
  } catch (error) {
    throw new Error("Error generating QR code");
  }
}

async function generateQRCodeFree(qrCodeValue, qrCodeFileName) {
  const imagePathQr = path.join(
    __dirname,
    "..",
    "public",
    "images",
    qrCodeFileName
  );
  try {
    const options = {
      width: 75,
      errorCorrectionLevel: "H",
    };

    const qrCodeImage = await qrcode.toFile(imagePathQr, qrCodeValue, options);
    return qrCodeImage;
  } catch (error) {
    throw new Error("Error generating QR code");
  }
}
module.exports = {
  generateQRCodeFree,
  generateQRCode,
};
