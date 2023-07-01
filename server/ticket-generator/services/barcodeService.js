const bwipjs = require("bwip-js");

async function generateBarcode(data) {
  return new Promise((resolve, reject) => {
    bwipjs.toBuffer(
      {
        bcid: "code128",
        text: data,
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: "center",
      },
      (err, png) => {
        if (err) {
          reject(new Error("Error generating barcode"));
        } else {
          resolve(png.toString("base64"));
        }
      }
    );
  });
}

module.exports = { generateBarcode };
