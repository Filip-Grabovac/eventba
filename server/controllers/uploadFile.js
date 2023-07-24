const fs = require("fs");
const path = require("path");
const { processImages } = require("../controllers/imageEditor");

const uploadImage = async (req, res) => {
  try {
    let { firstFiles, secondFiles } = req.files;
    console.log(firstFiles, secondFiles);

    // Upload firstFiles to another folder
    for (let i = 0; i < firstFiles.length; i++) {
      const file = firstFiles[i];
      const uploadPath = path.resolve(
        "ticket-gen",
        "public",
        "sponsors-temp",
        file.name
      );
      console.log("file_listed");
      await fs.promises.writeFile(uploadPath, file.data, { flag: "w" });
      console.log("File moved successfully:", file.name);
      await processImages("ticket-gen/public/sponsors-temp", "sponsors");
    }

    // Upload secondFiles to another folder
    for (let i = 0; i < secondFiles.length; i++) {
      const file = secondFiles[i];
      const uploadPath = path.resolve("event-images-temporary", file.name);
      console.log("2nd file_listed");
      await fs.promises.writeFile(uploadPath, file.data, { flag: "w" });
      console.log("File moved successfully:", file.name);
    }

    // Call the function
    await processImages("event-images-temporary", "event-images");

    // Remove images from temporary folders
    await removeTemporaryFiles(
      path.resolve("server", "event-images-temporary")
    );
    await removeTemporaryFiles(
      path.resolve("server", "ticket-gen", "public", "sponsors-temp")
    );

    res.status(200).json({ message: "Files uploaded successfully." });
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
};

module.exports = uploadImage;
