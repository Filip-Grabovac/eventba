// imageProcessor.js

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const processImages = async (input, output) => {
  const inputDir = path.resolve(__dirname, "..", input);
  const outputDir = path.resolve(
    __dirname,
    "..",
    "ticket-gen",
    "public",
    output
  );

  // Create the output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const imageFiles = await fs.promises.readdir(inputDir);

  for (const file of imageFiles) {
    const inputPath = `${inputDir}/${file}`;
    const outputPath = `${outputDir}/${file}`;

    let resizeOptions = {};

    if (file.endsWith("_landscape.jpg")) {
      resizeOptions = {
        width: 1120,
        height: 630,
        fit: sharp.fit.cover,
        position: sharp.strategy.entropy,
      };
    } else if (file.endsWith("_portrait.jpg")) {
      resizeOptions = {
        width: 600,
        height: 900,
        fit: sharp.fit.cover,
        position: sharp.strategy.entropy,
      };
    } else {
      resizeOptions = {
        height: 40,
        fit: sharp.fit.cover,
        position: sharp.strategy.entropy,
      };
    }

    try {
      await sharp(inputPath).resize(resizeOptions).toFile(outputPath);

      console.log("Optimized image:", outputPath);
    } catch (error) {
      console.error("Error processing image:", inputPath);
      console.error(error);
    }
  }
};

module.exports = {
  processImages,
};
