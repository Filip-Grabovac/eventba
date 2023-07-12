const EntranceController = require("../models/Entrance");

const getEntranceControllerById = async (req, res) => {
  try {
    const id = req.body.id;
    const entranceController = await EntranceController.find({
      organizer_id: id,
    }).select("-password");
    res.status(200).json({ entranceController });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const addEntranceController = async (req, res) => {
  try {
    const { event, entrance_num, name, password, organizer_id } = req.body;

    // Create a new EntranceController instance with the received data
    const entranceController = new EntranceController({
      event,
      entrance_num,
      name,
      password,
      organizer_id,
    });

    // Save the new entranceController to the database
    await entranceController.save();

    res.status(200).json({
      success: true,
      message: "Uspješno ste dodali kontrolora ulaza.",
      data: entranceController,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Došlo je do greške" });
  }
};

const deleteEntranceController = async (req, res) => {
  try {
    const id = req.body.id;
    await EntranceController.deleteOne({ _id: id });
    res.status(200).json({
      success: true,
      message: "Kontrolor ulaza je uspješno izbrisan.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Došlo je do greške" });
  }
};

module.exports = {
  getEntranceControllerById,
  addEntranceController,
  deleteEntranceController,
};
