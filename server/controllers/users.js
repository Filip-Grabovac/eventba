const User = require("../models/User");
const Helper = require("../models/Helper");
const sendVerificationEmail = require("../mailer/mailer");
const Encrypt = require("../functions/encrypt");
const jwt = require("jsonwebtoken");

const authenticateTokenFromBody = async (req, res, next) => {
  // Izdvoji token iz tijela zahtjeva
  const token = req.body.token || "";

  if (!token) {
    return res.status(401).json({ message: "Pogreška u zahtjevu." });
  }

  try {
    // Verificiraj token koristeći tajni ključ
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Provjeri postoji li korisnik povezan s tokenom
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Neispravan korisnik" });
    }

    // Pridruži dekodirani token objektu zahtjeva radi kasnije upotrebe
    req.user = decoded;

    // Nastavi do sljedećeg middlewarea ili završnog rukovatelja zahtjevima
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Sesija istekla. Ponovo se prijavite",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Find all users excluding sensitive information
    const users = await User.find({}, "-password -refresh_token");

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { email } = req.body.user;
    // Provjeri je li korisnik s navedenim e-mailom već registriran
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Korisnik s ovim e-mailom već postoji" });
    }
    const verificationCode = Math.floor(Math.random() * 100000000000) + 1;

    // If user is not verified, send verification mail.

    if (req.body.user.is_verified === false) {
      const verificationLink = `${process.env.REACT_APP_API_URL_FE}/verify/${verificationCode}`;
      sendVerificationEmail(
        req.body.user.email,
        "Verificiraj svoj Event.ba račun!",
        `U svrhu sigurnosti prilikom kupovine ulaznica, e-mail koji će te ovom prilikom verificirati biti će zadani mail za dostavu kupljenih ulaznica s vašeg event.ba računa. Prilikom kupovine možete odabrati opciju personalizacije ulaznice, gdje za svaku ulaznicu možete unijeti ime i prezime vlasnika ulaznice i e-mail na koji će ta ulaznica biti poslana. (Ukoliko želite pokloniti nekome ulaznicu).

        Klikom na link ispod započeti će te verifikaciju svog event.ba računa:`,

        "Link za verifkaciju",
        verificationLink
      );
    }

    const newUser = { ...req.body.user };
    if (newUser._id) {
      delete newUser._id;
    }

    // Kriptiraj lozinku prije spremanja
    newUser.password = Encrypt(newUser.password, process.env.SECRET_KEY);

    // Stvori novog korisnika ako ne postoji korisnik s istim e-mailom
    const user = await User.create({
      ...newUser,
      verificationCode,
    });

    // Generiraj JWT token za novog korisnika
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "12h", // Vrijeme isteka tokena (prilagodi prema potrebi)
      }
    );

    const { newsletter } = req.body.user;
    if (newsletter !== undefined) {
      await handleNewsletterSubscription(user.email, newsletter);
    }

    res.status(201).json({ id: user._id, token });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Došlo je do greške pri stvaranju korisnika" });
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
    res.status(500).json({ message: "Došlo je do greške pri verifikaciji. " });
  }
};

const findUsersByAccountType = async (req, res) => {
  try {
    const accountType = req.params.type;

    // Provjeravamo je li predana vrsta računa
    if (!accountType) {
      return res.status(400).json({ message: "Nedostaje vrsta računa" });
    }

    // Dohvaćamo sve korisnike s određenom vrstom računa
    const usersWithAccountType = await User.find({ role: accountType });

    // Provjeravamo jesu li pronađeni korisnici
    if (!usersWithAccountType || usersWithAccountType.length === 0) {
      return res
        .status(404)
        .json({ message: "Nema korisnika s tom vrstom računa" });
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
      return res.status(400).json({ message: "Pogrešna pretraga" });
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
          .json({ message: `Ne postoji korisnik s ovim ID-om: ${value}` });
      } else if (type === "email") {
        return res
          .status(404)
          .json({ message: `Ne postoji korisnik s ovim email-om: ${value}` });
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
      return res
        .status(404)
        .json({ message: `Ne postoji korisnik s ovim ID: ${userID}` });
    }

    // Check if the updated email already exists
    if (req.body.user.email !== user.email) {
      const existingUser = await User.findOne({ email: req.body.user.email });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Email već postoji u bazi podataka." });
      }
    }

    // Construct a minimal update payload with only the fields present in the request body
    const userUpdatePayload = {};
    for (const key in req.body.user) {
      if (key in user._doc) {
        userUpdatePayload[key] = req.body.user[key];
      }
    }

    // Check if the password is provided and encrypt it
    if (userUpdatePayload.password !== undefined) {
      userUpdatePayload.password = Encrypt(
        userUpdatePayload.password,
        process.env.SECRET_KEY
      );
    }

    // Update the user using findOneAndUpdate
    const updatedUser = await User.findOneAndUpdate(
      { _id: userID },
      userUpdatePayload,
      { new: true, runValidators: true }
    );

    const { newsletter } = req.body.user;
    if (newsletter !== undefined) {
      await handleNewsletterSubscription(user.email, newsletter);
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Došlo je do greške prilikom ažuriranja korisnika." });
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

    res.json({ message: "Korisnički račun je uspješno obrisan." });
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

const handleNewsletterSubscription = async (userEmail, newsletter) => {
  const helperId = "64ec823175ccc834678f4698";
  const helper = await Helper.findById(helperId);

  if (!helper) {
    throw new Error("Dokument pomoćnika nije pronađen.");
  }

  const newsletterArray = helper.newsletter || [];
  const newsletterIndex = newsletterArray.indexOf(userEmail);

  if (newsletterIndex !== -1 && !newsletter) {
    // Ako se e-pošta pronađe i newsletter je postavljen na false, ukloni je
    newsletterArray.splice(newsletterIndex, 1);
  } else if (newsletterIndex === -1 && newsletter) {
    // Ako se e-pošta ne pronađe i newsletter je postavljen na true, dodaj je
    newsletterArray.push(userEmail);
  }

  // Ažuriraj niz newslettera Helper dokumenta pomoću updateOne
  await Helper.updateOne({ _id: helperId }, { newsletter: newsletterArray });
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
  authenticateTokenFromBody,
};
