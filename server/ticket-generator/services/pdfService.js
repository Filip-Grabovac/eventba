const pdf = require("html-pdf");
const fs = require("fs");

function convertToPDF(htmlTemplate) {
  return new Promise((resolve, reject) => {
    pdf.create(htmlTemplate).toBuffer((err, buffer) => {
      if (err) {
        reject(new Error("Error converting to PDF"));
      } else {
        resolve(buffer);
      }
    });
  });
}

module.exports = { convertToPDF };
