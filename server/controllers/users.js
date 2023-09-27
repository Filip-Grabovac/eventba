const User = require("../models/User");
const Helper = require("../models/Helper");
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
    if (req.body.is_verified === false) {
      const verificationLink = `${process.env.REACT_APP_API_URL_FE}/verify/${req.body.verificationCode}`;
      sendVerificationEmail(
        req.body.email,
        "Verificiraj svoj Event.ba račun!",
        `U svrhu sigurnosti prilikom kupovine ulaznica, e-mail koji će te ovom prilikom verificirati biti će zadani mail za dostavu kupljenih ulaznica s vašeg event.ba računa. Prilikom kupovine možete odabrati opciju personalizacije ulaznice, gdje za svaku ulaznicu možete unijeti ime i prezime vlasnika ulaznice i e-mail na koji će ta ulaznica biti poslana. (Ukoliko želite pokloniti nekome ulaznicu).

        Klikom na link ispod započeti će te verifikaciju svog event.ba računa:`,

        "Link za verifkaciju",
        verificationLink
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
      { $set: { is_verified: true }, $unset: { verificationCode: "" } },
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

const findUsersByAccountType = async (req, res) => {
  try {
    const accountType = req.params.type;

    // Provjeravamo je li predana vrsta računa
    if (!accountType) {
      return res.status(400).json({ error: "Nedostaje vrsta računa" });
    }

    // Dohvaćamo sve korisnike s određenom vrstom računa
    const usersWithAccountType = await User.find({ role: accountType });

    // Provjeravamo jesu li pronađeni korisnici
    if (!usersWithAccountType || usersWithAccountType.length === 0) {
      return res
        .status(404)
        .json({ error: "Nema korisnika s tom vrstom računa" });
    }
    if (accountType === "reseller") {
      const resellerInfoList = usersWithAccountType.map(
        (user) => user.reseller_info
      );
      return res.status(200).json(resellerInfoList);
    }
    // Vraćamo pronađene korisnike
    return res.status(200).json(usersWithAccountType);
  } catch (error) {
    res.status(500).json({
      error: "Došlo je do greške na serveru, molimo pokušajte kasnije",
    });
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
    } else if (type === "role") {
      query = { role: value };
    } else {
      return res.status(400).json({ error: "Pogrešna pretraga" });
    }

    let user;
    if (type === "role") {
      user = await User.find(query);
      return res.status(200).json(user);
    } else {
      user = await User.findOne(query);
    }

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
    return res.status(200).json({
      id: user._id,
      password: user.password,
      accountType: user.accountType,
      is_banned: user.is_banned,
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
    const user = await User.findOne({ _id: userID });

    if (!user) {
      return res.status(404).json({ msg: `No user with this id: ${userID}` });
    }

    // Check if the updated email already exists
    if (req.body.email !== user.email) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res
          .status(400)
          .json({ msg: "Email već postoji u bazi podataka." });
      }
    }

    // Update the user
    const updatedUser = await User.findOneAndUpdate({ _id: userID }, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const searchUser = async (req, res) => {
  try {
    const searchInput = req.params.search_input.trim();
    const searchTerms = searchInput.split(" ");

    // Create an array of regex patterns for each term
    const regexPatterns = searchTerms.map((term) => new RegExp(term, "i"));

    // Construct an array of $and conditions to match each term in any order
    const orConditions = regexPatterns.map((regex) => ({
      $or: [{ full_name: regex }, { email: regex }],
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
      return res.status(404).json({ message: "Korisnik nije pronađen." });
    }

    // Update the ban status
    user.is_banned = ban_status === "true";
    await user.save();

    // Step 1: Find the document with the "resellers_requests" property using Helper model
    const documentWithSponsors = await Helper.findOne({
      resellers_requests: { $exists: true },
    });

    // Check if the document with resellers_requests property exists
    if (!documentWithSponsors) {
      return res.status(404).json({ message: "Dokument nije pronađen." });
    }

    // Step 2: Remove the userId from the "resellers_requests" array in Helper document
    documentWithSponsors.resellers_requests =
      documentWithSponsors.resellers_requests.filter((id) => id !== user_id);
    await documentWithSponsors.save();

    res.json({
      message: `Korisnički ban status je postavljen na ${ban_status}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Serverska greška." });
  }
};

const updateUserRole = async (req, res) => {
  const { id, role } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Korisnik nije pronađen." });
    }

    // Update the user role
    user.role = role; // Assuming the user model has a property called 'role'

    // Save the updated user
    await user.save();

    res.json({ message: `Uspješno ste ažurirali korisnikov tip računa.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Serverska greška." });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Korisnik nije pronađen." });
    }

    // Delete the user from the database
    await user.remove();

    res.json({ message: "Korisnik je uspješno obrisan." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Serverska greška." });
  }
};

const getUserRole = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Korisnik nije pronađen." });
    }

    // Extract the "role" property from the user object
    const { role } = user;

    res.json({ role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Serverska greška." });
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
  findUsersByAccountType,
};
