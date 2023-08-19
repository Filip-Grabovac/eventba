const fs = require("fs").promises;
const path = require("path");
const { processImages } = require("../controllers/imageEditor");

const uploadImage = async (req, res) => {
  try {
    const { firstFiles, secondFiles } = req.files;

    // Ensure the existence of the upload folders
    const sponsorsTempDir = path.join(
      __dirname,
      "..",
      "ticket-gen",
      "public",
      "sponsors-temp"
    );
    const eventImagesTempDir = path.join(
      __dirname,
      "..",
      "event-images-temporary"
    );
    await Promise.all([
      fs.mkdir(sponsorsTempDir, { recursive: true }),
      fs.mkdir(eventImagesTempDir, { recursive: true }),
    ]);

    // Upload firstFiles to sponsors-temp folder
    if (firstFiles) {
      const firstFilesArray = Array.isArray(firstFiles)
        ? firstFiles
        : [firstFiles];
      for (const file of firstFilesArray) {
        const uploadPath = path.join(sponsorsTempDir, file.name);
        await fs.writeFile(uploadPath, file.data, {
          flag: "w",
          encoding: "utf8",
        });
        console.log("File moved successfully:", file.name);
      }
    }

    // Upload secondFiles to event-images-temporary folder
    for (const file of secondFiles) {
      const uploadPath = path.join(eventImagesTempDir, file.name);
      await fs.writeFile(uploadPath, file.data, {
        flag: "w",
        encoding: "utf8",
      });
      console.log("File moved successfully:", file.name);
    }

    // Call the function to optimize and compress the images
    await Promise.all([
      processImages("event-images-temporary", "event-images"),
      processImages("ticket-gen/public/sponsors-temp", "sponsors"),
    ]);

    // Remove images from temporary folders
    await removeTemporaryFiles(eventImagesTempDir);
    await removeTemporaryFiles(sponsorsTempDir);

    res.status(200).json({ message: "Datoteke uspješno dodane." });
  } catch (error) {
    console.error("Greška pri dodavnju datoteka:", error);
    res.status(500).json({ error: "Greška pri dodavnju datoteka." });
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
