const barcodeService = require("../services/barcodeService");

async function generateBarcode(data) {
  try {
    const barcodeImage = await barcodeService.generateBarcode(data);
    return barcodeImage;
  } catch (error) {
    throw new Error("Error generating barcode");
  }
}

module.exports = { generateBarcode };
