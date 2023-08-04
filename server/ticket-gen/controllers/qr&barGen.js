const bwipjs = require("bwip-js");
const qrcode = require("qrcode");
const fs = require("fs");
const path = require("path");

async function generateBarcode(barcodeValue) {
  const imagePathBar = path.join(
    __dirname,
    "..",
    "public",
    "images",
    "barCode.png"
  );

  return new Promise((resolve, reject) => {
    bwipjs.toBuffer(
      {
        bcid: "code128", // Barcode type
        text: barcodeValue, // Barcode value
        scale: 5, // Scaling factor
        height: 15, // Barcode height
        includetext: false, // Include human-readable text
        backgroundcolor: "ffffff", // Background color
        barcolor: "000000", // Barcode color
      },
      function (err, png) {
        if (err) {
          reject(err);
        } else {
          fs.writeFile(imagePathBar, png, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        }
      }
    );
  });
}
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
  generateBarcode,
  generateQRCode,
};
