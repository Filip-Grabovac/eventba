const User = require("../models/User");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const createUser = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Korisnik s ovim emailom već postoji" });
    }

    // Create a new user if no existing user found
    const user = await User.create(req.body);
    res.status(201).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Došlo je do greške pri unosu " });
  }
};

const findUser = async (req, res) => {
  try {
    const { email: emailUser } = req.params;
    const user = await User.findOne({ email: emailUser });
    if (!user) {
      return res
        .status(404)
        .json({ error: `Ne postoji korisnik s tim emailom: ${emailUser}` });
    }
    res.status(200).json(user.password);
  } catch (error) {
    res.status(500).json({
      error:
        "Dogodila se greška sa serverom pri pretraživanju, pokušajte kasnije",
    });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  findUser,
};
