const { exec } = require("child_process");
const sharp = require("sharp");
const fs = require("fs");

const inputDir = "../event-images";
const outputDir = "../event-images-remastered";

const reduceImageSize = async (inputPath, outputPath) => {
  await sharp(inputPath)
    .resize({
      width: 1920,
      height: 1080,
      fit: sharp.fit.cover,
      position: sharp.strategy.entropy,
    })
    .toFile(outputPath);
};

const processImages = async () => {
  const imageFiles = await fs.promises.readdir(inputDir);

  for (const file of imageFiles) {
    const inputPath = `${inputDir}/${file}`;
    const outputPath = `${outputDir}/${file}`;

    await reduceImageSize(inputPath, outputPath);
    await compressImage(outputPath);
  }
};

const compressImage = (filePath) => {
  return new Promise((resolve, reject) => {
    const command = `npx imagemin ${filePath} --out-dir ${outputDir} --plugin=jpegtran --plugin=pngquant --quality=[0.6,0.8]`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        console.log("Optimized image:", filePath);
        resolve();
      }
    });
  });
};

processImages().catch((error) => {
  console.error("Error processing images:", error);
});
