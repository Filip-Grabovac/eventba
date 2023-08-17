const fs = require("fs").promises;
const path = require("path");
const { processImages } = require("../controllers/imageEditor");

const uploadImage = async (req, res) => {
  try {
    const { firstFiles, secondFiles } = req.files;

    // Convert to an array if only one file is uploaded
    const firstFilesArray = Array.isArray(firstFiles)
      ? firstFiles
      : [firstFiles];

    // Upload firstFiles to another folder
    await Promise.all(
      firstFilesArray.map(async (file) => {
        const uploadPath = path.join(
          __dirname,
          "..",
          "ticket-gen",
          "public",
          "sponsors-temp",
          file.name
        );
        await fs.writeFile(uploadPath, file.data, { flag: "w" });
        console.log("File moved successfully:", file.name);
      })
    );

    // Upload secondFiles to another folder
    await Promise.all(
      secondFiles.map(async (file) => {
        const uploadPath = path.join(
          __dirname,
          "..",
          "event-images-temporary",
          file.name
        );

        await fs.writeFile(uploadPath, file.data, { flag: "w" });
        console.log("File moved successfully:", file.name);
      })
    );

    // Call the function to optimize and compress the images
    await Promise.all([
      processImages("event-images-temporary", "event-images"),
      processImages("ticket-gen/public/sponsors-temp", "sponsors"),
    ]);

    // Remove images from temporary folders
    await removeTemporaryFiles(
      path.resolve(__dirname, "..", "event-images-temporary")
    );
    await removeTemporaryFiles(
      path.resolve(__dirname, "..", "ticket-gen", "public", "sponsors-temp")
    );

    res.status(200).json({ message: "Successful file upload." });
  } catch (error) {
    console.error("Error during image upload:", error);
    res.status(500).json({ error: "Error uploading files." });
  }
};

const removeTemporaryFiles = async (folderPath) => {
  try {
    const tempFiles = await fs.readdir(folderPath);

    await Promise.all(
      tempFiles.map(async (file) => {
        const filePath = path.join(folderPath, file);
        await fs.unlink(filePath);
        console.log("Temporary image deleted:", filePath);
      })
    );
  } catch (error) {
    console.error("Error removing temporary files:", error);
  }
};

module.exports = uploadImage;
