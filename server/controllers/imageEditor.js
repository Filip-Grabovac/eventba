const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");

const processImages = async (input, output) => {
  try {
    const inputDir = path.resolve(__dirname, "..", input);
    const outputDir = path.resolve(
      __dirname,
      "..",
      "ticket-gen",
      "public",
      output
    );

    // Create the output directory if it doesn't exist
    await fs.mkdir(outputDir, { recursive: true });

    const imageFiles = await fs.readdir(inputDir);

    for (const file of imageFiles) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file);

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
          height: 55,
          fit: sharp.fit.cover,
          position: sharp.strategy.entropy,
        };
      }

      await sharp(inputPath).resize(resizeOptions).toFile(outputPath);
      console.log("Optimized image:", outputPath);
    }
  } catch (error) {
    console.error("Error processing images:", error);
  }
};

module.exports = {
  processImages,
};
