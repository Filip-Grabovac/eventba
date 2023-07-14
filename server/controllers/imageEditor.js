// imageProcessor.js

const { exec } = require("child_process");
const sharp = require("sharp");
const fs = require("fs");

const inputDir = "../server/event-images-temporary";
const outputDir = "../server/ticket-gen/public/event-images";

const processImages = async () => {
  const imageFiles = await fs.promises.readdir(inputDir);

  for (const file of imageFiles) {
    const inputPath = `${inputDir}/${file}`;
    const outputPath = `${outputDir}/${file}`;

    let resizeOptions = {
      width: 1920,
      height: 1080,
      fit: sharp.fit.cover,
      position: sharp.strategy.entropy,
    };

    if (file.endsWith("_landscape.jpg")) {
      resizeOptions.height = 1080;
    } else if (file.endsWith("_portrait.jpg")) {
      resizeOptions = {
        width: 800,
        height: 1200,
        fit: sharp.fit.cover,
        position: sharp.strategy.entropy,
      };
    }

    try {
      await sharp(inputPath).resize(resizeOptions).toFile(outputPath);

      await compressImage(outputPath);

      console.log("Optimized image:", outputPath);
    } catch (error) {
      console.error("Error processing image:", inputPath);
      console.error(error);
    }
  }
};

const compressImage = (filePath) => {
  return new Promise((resolve, reject) => {
    const command = `npx imagemin ${filePath} --out-dir ${outputDir} --plugin=jpegtran --plugin=pngquant --quality=80-90`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

module.exports = {
  processImages,
};
