// imageProcessor.js

const { exec } = require("child_process");
const sharp = require("sharp");
const fs = require("fs");

const processImages = async (input, output) => {
  const inputDir = `../server/${input}`;
  const outputDir = `../server/ticket-gen/public/${output}`;

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
        height: 80,
        fit: sharp.fit.cover,
        position: sharp.strategy.entropy,
      };
    }

    try {
      await sharp(inputPath).resize(resizeOptions).toFile(outputPath);

      await compressImage(outputPath, outputDir);

      console.log("Optimized image:", outputPath);
    } catch (error) {
      console.error("Error processing image:", inputPath);
      console.error(error);
    }
  }
  const compressImage = (filePath, outputDir) => {
    return new Promise((resolve, reject) => {
      const command = `npx imagemin ${filePath} --out-dir ${outputDir} --plugin=jpegtran --plugin=pngquant --quality=20-40`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          console.log("Image compression completed successfully");
          resolve();
        }
      });
    });
  };
};

module.exports = {
  processImages,
};
