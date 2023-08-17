const EntranceController = require('../models/Entrance');

const getEntranceControllerById = async (req, res) => {
  try {
    const id = req.body.id;
    const entranceController = await EntranceController.find({
      organizer_id: id,
    }).select('-password');
    res.status(200).json({ entranceController });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const addEntranceController = async (req, res) => {
  try {
    const {
      event,
      entrance_num,
      name,
      password,
      organizer_id,
      collection_name,
    } = req.body;

    // Create a new EntranceController instance with the received data
    const entranceController = new EntranceController({
      event,
      entrance_num,
      name,
      password,
      organizer_id,
      collection_name,
    });

    // Save the new entranceController to the database
    await entranceController.save();

    res.status(200).json({
      success: true,
      message: 'Uspješno ste dodali kontrolora ulaza.',
      data: entranceController,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Došlo je do greške' });
  }
};

const deleteEntranceController = async (req, res) => {
  try {
    const id = req.body.id;
    await EntranceController.deleteOne({ _id: id });
    res.status(200).json({
      success: true,
      message: 'Kontrolor ulaza je uspješno izbrisan.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Došlo je do greške' });
  }
};

const getEntranceControllerByUsername = async (req, res) => {
  try {
    const username = req.body.name;
    const password = req.body.password;

    const entranceController = await EntranceController.find({
      name: username,
      password: password,
    }).select('-password');

    if (entranceController[0] !== undefined)
      res.status(200).json({
        message: 'Uspješno ste se prijavili',
        id: entranceController[0]._id,
        collection_name: entranceController[0].collection_name,
      });
    else
      res
        .status(401)
        .json({ message: 'Korisničko ime ili lozinka nisu točni' });
  } catch (error) {
    res.status(500).json({ message: 'Korisničko ime ili lozinka nisu točni' });
  }
};

const updateEntranceControllerById = async (req, res) => {
  try {
    const controllerId = req.params.id;
    const {
      event,
      entrance_num,
      name,
      password,
      organizer_id,
      collection_name,
    } = req.body;

    const updateObject = {
      event,
      entrance_num,
      name,
      organizer_id,
      collection_name,
    };

    if (password !== '') {
      updateObject.password = password;
    }

    const updatedController = await EntranceController.findByIdAndUpdate(
      controllerId,
      updateObject,
      { new: true }
    );

    if (updatedController) {
      res.status(200).json({
        message: 'Uspješno ste uredili kontrolora ulaza.',
        updatedController,
      });
    } else {
      res.status(404).json({ message: 'Kontrolor nije pronađen.' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Pojavila se greška pri uređivanju kontrolora.' });
  }
};

module.exports = {
  getEntranceControllerById,
  addEntranceController,
  deleteEntranceController,
  getEntranceControllerByUsername,
  updateEntranceControllerById,
};
