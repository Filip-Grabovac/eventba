const User = require('../models/User');
const sendVerificationEmail = require('../mailer/mailer');

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
        .json({ error: 'Korisnik s ovim emailom već postoji' });
    }

    // If user is not verified, send verification mail.
    if (req.body.isVerified === false) {
      const verificationLink = `http://localhost:3000/verify/${req.body.verificationCode}`;
      const email = await sendVerificationEmail(
        req.body.email,
        'Verificiraj svoj Event.ba račun!',
        `Klikom na link ispod započet će te verifikaciju svog event.ba računa: ${verificationLink}`
      );
    }

    // Create a new user if no existing user found
    const user = await User.create(req.body);

    res.status(201).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Došlo je do greške pri unosu ' });
  }
};

const verifyUser = async (req, res) => {
  try {
    const { verificationCode } = req.params;

    const existingUserWithCode = await User.findOneAndUpdate(
      { verificationCode: Number(verificationCode) },
      { $set: { isVerified: true }, $unset: { verificationCode: '' } },
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
    res.status(200).json({ msg: 'Uspješna verifikacija!' });
  } catch (error) {
    res.status(500).json({ error: 'Došlo je do greške pri verifikaciji. ' });
  }
};

const findUser = async (req, res) => {
  try {
    const { type, value } = req.params;
    let query;

    if (type === 'email') {
      query = { email: value };
    } else if (type === 'fbEmail') {
      query = { fbEmail: value };
    } else if (type === 'id') {
      query = { _id: value };
    } else {
      return res.status(400).json({ error: 'Pogrešna pretraga' });
    }

    const user = await User.findOne(query);
    if (!user) {
      if (type === 'id') {
        return res
          .status(404)
          .json({ error: `Ne postoji korisnik s ovim ID-om: ${value}` });
      } else if (type === 'email') {
        return res
          .status(404)
          .json({ error: `Ne postoji korisnik s ovim email-om: ${value}` });
      }
    }

    if (type === 'id') {
      // Return the whole user object when searching by ID
      return res.status(200).json(user);
    }

    // Only return the ID and password when searching by email
    res.status(200).json({
      id: user._id,
      password: user.password,
      accountType: user.accountType,
      isBanned: user.isBanned,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Došlo je do greške na serveru, molimo pokušajte kasnije',
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

const searchUser = async (req, res) => {
  try {
    const searchInput = req.params.search_input.trim();
    const searchTerms = searchInput.split(' ');

    // Create an array of regex patterns for each term
    const regexPatterns = searchTerms.map((term) => new RegExp(term, 'i'));

    // Construct an array of $and conditions to match each term in any order
    const orConditions = regexPatterns.map((regex) => ({
      $or: [{ fullName: regex }, { email: regex }],
    }));

    const users = await User.find({
      $and: orConditions,
    }).limit(10); // limit 10

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const setUserBanStatus = async (req, res) => {
  const { user_id, ban_status } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    // Update the ban status
    user.isBanned = ban_status === 'true';

    // Save the updated user
    await user.save();

    res.json({
      message: `Korisnički ban status je posavljen na ${ban_status}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Serverska greška.' });
  }
};

const updateUserRole = async (req, res) => {
  const { id, role } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    // Update the user role
    user.role = role; // Assuming the user model has a property called 'role'

    // Save the updated user
    await user.save();

    res.json({ message: `Uspješno ste ažurirali korisnikov tip računa.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Serverska greška.' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    // Delete the user from the database
    await user.remove();

    res.json({ message: 'Korisnik je uspješno obrisan.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Serverska greška.' });
  }
};

const getUserRole = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    // Extract the "role" property from the user object
    const { role } = user;

    res.json({ role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Serverska greška.' });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  findUser,
  updateUser,
  verifyUser,
  searchUser,
  setUserBanStatus,
  updateUserRole,
  deleteUser,
  getUserRole,
};
