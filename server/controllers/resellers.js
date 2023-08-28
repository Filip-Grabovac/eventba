const User = require('../models/User');
const Helper = require('../models/Helper');

const createReseller = async (req, res) => {
  try {
    const userId = req.params.id;

    // Step 1: Find the document with the "resellers_requests" property using Helper model
    const documentWithSponsors = await Helper.findOne({
      resellers_requests: { $exists: true },
    });

    // Check if the document with resellers_requests property exists
    if (!documentWithSponsors) {
      return res.status(404).json({ message: 'Dokument nije pronađen.' });
    }

    // Add the userId to the "resellers_requests" array in Helper document
    if (!documentWithSponsors.resellers_requests.includes(userId)) {
      documentWithSponsors.resellers_requests.push(userId);
      await documentWithSponsors.save();
    }

    // Step 2: Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    // Add the "reseller_info" object to the user
    user.reseller_info = req.body;
    await user.save();

    return res.status(200).json({ message: 'Uspješno ste poslali zahtjev.' });
  } catch (error) {
    return res.status(500).json({ message: 'Serverska greška.' });
  }
};

const getAllResellers = async (req, res) => {
  try {
    // Step 1: Find the document with the "resellers_requests" property using Helper model
    const documentWithSponsors = await Helper.findOne({
      resellers_requests: { $exists: true },
    });
    console.log(documentWithSponsors);

    // Check if the document with resellers_requests property exists
    if (!documentWithSponsors) {
      return res.status(404).json({ message: 'Dokument nije pronađen.' });
    }

    const resellersIds = documentWithSponsors.resellers_requests;

    // Step 2: Find all users whose IDs are present in the "resellers_requests" array
    const resellers = await User.find({ _id: { $in: resellersIds } });

    // Return the array with users' data
    return res.status(200).json({ resellers });
  } catch (error) {
    return res.status(500).json({ message: 'Serverska greška.' });
  }
};

const setReseller = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    // Step 1: Find the document with the "resellers_requests" property using Helper model
    const documentWithSponsors = await Helper.findOne({
      resellers_requests: { $exists: true },
    });

    // Check if the document with resellers_requests property exists
    if (!documentWithSponsors) {
      return res.status(404).json({ message: 'Dokument nije pronađen.' });
    }

    // Change the "role" property of the user to "reseller"
    user.role = 'reseller';
    await user.save();

    // Step 2: Remove the userId from the "resellers_requests" array in Helper document
    documentWithSponsors.resellers_requests =
      documentWithSponsors.resellers_requests.filter((id) => id !== userId);
    await documentWithSponsors.save();

    return res
      .status(200)
      .json({ message: 'Korisniku je dodijeljena uloga preprodavača.' });
  } catch (error) {
    return res.status(500).json({ message: 'Serverska greška.' });
  }
};

const removeReseller = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    // Step 1: Find the document with the "resellers_requests" property using Helper model
    const documentWithSponsors = await Helper.findOne({
      resellers_requests: { $exists: true },
    });

    // Check if the document with resellers_requests property exists
    if (!documentWithSponsors) {
      return res.status(404).json({ message: 'Dokument nije pronađen.' });
    }

    // Step 2: Remove the userId from the "resellers_requests" array in Helper document
    documentWithSponsors.resellers_requests =
      documentWithSponsors.resellers_requests.filter((id) => id !== userId);
    await documentWithSponsors.save();

    // Delete the "reseller_info" property from the user
    user.reseller_info = undefined;
    await user.save();

    return res
      .status(200)
      .json({ message: 'Zahtjev preprodavača je uklonjen.' });
  } catch (error) {
    return res.status(500).json({ message: 'Serverska greška.' });
  }
};

module.exports = {
  createReseller,
  getAllResellers,
  setReseller,
  removeReseller,
};
