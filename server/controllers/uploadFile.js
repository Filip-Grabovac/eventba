const fs = require("fs");
const path = require("path");
const { processImages } = require("../controllers/imageEditor");
const inputDir = "../server/event-images-temporary";
const outputDir = "../server/ticket-gen/public/event-images";

const uploadImage = async (req, res) => {
  try {
    let { firstFiles, secondFiles } = req.files;

    // If it's just one file to upload, it will be an object so we transform it to an array
    if (typeof firstFiles === "object") {
      firstFiles = [firstFiles];
    }

    // Upload firstFiles to another folder
    for (let i = 0; i < firstFiles.length; i++) {
      const file = firstFiles[i];
      const uploadPath = path.join(
        __dirname,
        "..",
        "ticket-gen",
        "public",
        "sponsors",
        file.name
      );

      await fs.promises.writeFile(uploadPath, file.data, { flag: "w" });
      console.log("File moved successfully:", file.name);
    }

    // Upload secondFiles to another folder
    for (let i = 0; i < secondFiles.length; i++) {
      const file = secondFiles[i];
      const uploadPath = path.join(
        __dirname,
        "..",
        "event-images-temporary",
        file.name
      );

      await fs.promises.writeFile(uploadPath, file.data, { flag: "w" });
      console.log("File moved successfully:", file.name);
    }

    // Call the function
    await processImages();
    console.log("Image processing completed successfully.");

    // Remove images from event-images-temporary folder
    const tempFiles = await fs.promises.readdir(inputDir);
    for (const file of tempFiles) {
      const filePath = path.join(inputDir, file);
      await fs.promises.unlink(filePath);
      console.log("Temporary image deleted:", filePath);
    }

    res.status(200).json({ message: "Files uploaded successfully." });
  } catch (error) {
    console.error("Error during image upload:", error);
    res.status(500).json({ error: "Error uploading files." });
  }
};

module.exports = uploadImage;
