const fs = require("fs");
const path = require("path");
const { processImages } = require("../controllers/imageEditor");

const uploadImage = async (req, res) => {
  try {
    let { firstFiles, secondFiles } = req.files;

    // Upload firstFiles to another folder
    for (let i = 0; i < firstFiles.length; i++) {
      const file = firstFiles[i];
      const uploadPath = path.join(
        __dirname, // Get the current directory path
        "..",
        "ticket-gen",
        "public",
        "sponsors-temp",
        file.name
      );

      await fs.promises.writeFile(uploadPath, file.data, { flag: "w" });
      console.log("File moved successfully:", file.name);
    }

    // Upload secondFiles to another folder
    for (let i = 0; i < secondFiles.length; i++) {
      const file = secondFiles[i];
      const uploadPath = path.join(
        __dirname, // Get the current directory path
        "..",
        "event-images-temporary",
        file.name
      );
      console.log("2nd file_listed");
      await fs.promises.writeFile(uploadPath, file.data, { flag: "w" });
      console.log("File moved successfully:", file.name);
    }

    // Call the function to optimize and compress the images in event-images-temporary
    await processImages("event-images-temporary", "event-images");
    await processImages("ticket-gen/public/sponsors-temp", "sponsors");
    // Remove images from temporary folders
    await removeTemporaryFiles(
      path.resolve(__dirname, "..", "event-images-temporary")
    );
    await removeTemporaryFiles(
      path.resolve(__dirname, "..", "ticket-gen", "public", "sponsors-temp")
    );

    res.status(200).json({ message: "Uspješan upload datoteka." });
  } catch (error) {
    console.error("Error during image upload:", error);
    res.status(500).json({ error: "Error uploading files." });
  }
};

const removeTemporaryFiles = async (folderPath) => {
  const tempFiles = await fs.promises.readdir(folderPath);

  for (const file of tempFiles) {
    const filePath = path.join(folderPath, file);
    await fs.promises.unlink(filePath);
    console.log("Temporary image deleted:", filePath);
  }
  return;
};

module.exports = uploadImage;
