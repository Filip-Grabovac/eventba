const Concert = require("../models/Concert");
const fs = require("fs");
const path = require("path");

const getAllConcerts = async (req, res) => {
  try {
    const concerts = await Concert.find({});
    res.status(200).json({ concerts });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const findConcert = async (req, res) => {
  try {
    const { type, value } = req.params;
    let query;
    if (type === "is_promoted_event") {
      query = { is_promoted_event: value === "true" };
    } else if (type === "id") {
      query = { _id: value };
    } else if (type === "this_week") {
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      query = { time_of_event: { $gte: today, $lt: nextWeek } };
    } else if (type === "type") {
      query = { type: { $in: [value] } };
    } else if (type === "search") {
      query = { performer_name: { $regex: value, $options: "i" } };
    } else {
      return res.status(400).json({ error: "Pogrešna pretraga" });
    }

    const concert = await Concert.find(query);

    if (
      type === "id" ||
      type === "this_week" ||
      type === "type" ||
      type === "search"
    ) {
      // Return the whole concert object when searching by ID
      return res.status(200).json(concert);
    }

    const filteredConcerts = concert.map(({ _id, poster }) => ({
      _id,
      poster,
    }));
    res.status(200).json(filteredConcerts);
  } catch (error) {
    res.status(500).json({
      error: "Došlo je do greške na serveru, molimo pokušajte kasnije",
    });
  }
};

const createEvent = async (req, res) => {
  try {
    // Create new event
    const event = await Concert.create(req.body);

    res
      .status(201)
      .json({ message: "Uspješno ste dodali događaj", eventData: event });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Došlo je do greške pri unosu " });
  }
};

const uploadImage = (req, res) => {
  let { firstFiles, secondFiles } = req.files;

  // If its just one file to upload, it will be object so we transform it to array
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
      "images",
      file.name
    );

    file.mv(uploadPath, (error) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Error uploading files." });
        return;
      }
      console.log("File moved successfully: ", file.name);
    });
  }

  // Upload secondFiles to another folder
  for (let i = 0; i < secondFiles.length; i++) {
    const file = secondFiles[i];
    const uploadPath = path.join(__dirname, "..", "event-images", file.name);

    file.mv(uploadPath, (error) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Error uploading files." });
        return;
      }
      console.log("File moved successfully: ", file.name);
    });
  }

  res.status(200).json({ message: "Files uploaded successfully." });
};

module.exports = {
  getAllConcerts,
  findConcert,
  createEvent,
  uploadImage,
};
