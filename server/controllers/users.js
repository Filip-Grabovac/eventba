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
    const { type, value } = req.params;
    let query;

    if (type === "email") {
      query = { email: value };
    } else if (type === "id") {
      query = { _id: value };
    } else {
      return res.status(400).json({ error: "Pogrešna pretraga" });
    }

    const user = await User.findOne(query);
    if (!user) {
      if (type === "id") {
        return res
          .status(404)
          .json({ error: `Ne postoji korisnik s ovim ID-om: ${value}` });
      } else if (type === "email") {
        return res
          .status(404)
          .json({ error: `Ne postoji korisnik s ovim email-om: ${value}` });
      }
    }

    if (type === "id") {
      // Return the whole user object when searching by ID
      return res.status(200).json(user);
    }

    // Only return the ID and password when searching by email
    res.status(200).json({
      id: user._id,
      password: user.password,
      accountType: user.accountType,
    });
  } catch (error) {
    res.status(500).json({
      error: "Došlo je do greške na serveru, molimo pokušajte kasnije",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id: userID } = req.params;
    const user = await User.findOneAndUpdate({ _id: userID }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ msg: `No task with id: ${userID}` });
    }
    res.status(200).json({});
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  findUser,
  updateUser,
};
