const User = require("../models/User");
const sendVerificationEmail = require("../mailer/mailer");

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

    // If user is not verified, send verification mail.
    if (req.body.isVerified === false) {
      const verificationLink = `http://localhost:3000/verify/${req.body.verificationCode}`;
      const email = await sendVerificationEmail(
        req.body.email,
        "Verificiraj svoj Event.ba račun!",
        `Klikom na link ispod započet će te verifikaciju svog event.ba računa: ${verificationLink}`
      );
    }

    // Create a new user if no existing user found
    const user = await User.create(req.body);

    res.status(201).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Došlo je do greške pri unosu " });
  }
};

const verifyUser = async (req, res) => {
  try {
    const { verificationCode } = req.params;

    const existingUserWithCode = await User.findOneAndUpdate(
      { verificationCode: Number(verificationCode) },
      { $set: { isVerified: true }, $unset: { verificationCode: "" } },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!existingUserWithCode) {
      return res
        .status(404)
        .json({ msg: `Verifikacijiski kod nije važeći: ${verificationCode}.` });
    }
    res.status(200).json({ msg: "Uspješna verifikacija!" });
  } catch (error) {
    res.status(500).json({ error: "Došlo je do greške pri verifikaciji. " });
  }
};

const findUser = async (req, res) => {
  try {
    const { type, value } = req.params;
    let query;

    if (type === "email") {
      query = { email: value };
    } else if (type === "fbEmail") {
      query = { fbEmail: value };
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
      return res
        .status(404)
        .json({ msg: `Nema korisnika s ovim id-om: ${userID}` });
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
  verifyUser,
};
