const User = require('../models/User');

const createReseller = async (req, res) => {
  try {
    const userId = req.params.id;
    const adminId = '64abebf0437ec5030c423540';

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    // Find the admin user by adminId
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin nije pronađen.' });
    }

    // Add the userId to the "resellers_requests" array in admin
    if (!admin.resellers_requests.includes(userId)) {
      admin.resellers_requests.push(userId);
      await admin.save();
    }

    // Add the "reseller_info" object to the user
    user.reseller_info = req.body;
    await user.save();

    return res.status(200).json({ message: 'Uspješno ste poslali zahjev.' });
  } catch (error) {
    return res.status(500).json({ message: 'Serverska greška.' });
  }
};

const getAllResellers = async (req, res) => {
  try {
    const adminId = '64abebf0437ec5030c423540';

    // Find the admin user by adminId
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin nije pronađen.' });
    }

    const resellersIds = admin.resellers_requests;

    // Find all users whose IDs are present in the "resellers_requests" array
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
    const adminId = '64abebf0437ec5030c423540';

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    // Find the admin user by adminId
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin nije pronađen.' });
    }

    // Change the "role" property of the user to "reseller"
    user.role = 'reseller';
    await user.save();

    // Remove the userId from the "resellers_requests" array in admin
    admin.resellers_requests = admin.resellers_requests.filter(
      (id) => id !== userId
    );
    await admin.save();

    return res.status(200).json({ message: 'Korisnik je postao preprodavač.' });
  } catch (error) {
    return res.status(500).json({ message: 'Serverska greška.' });
  }
};

const removeReseller = async (req, res) => {
  try {
    const userId = req.params.id;
    const adminId = '64abebf0437ec5030c423540';

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    // Find the admin user by adminId
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin nije pronađen.' });
    }

    // Remove the userId from the "resellers_requests" array in admin
    admin.resellers_requests = admin.resellers_requests.filter(
      (id) => id !== userId
    );
    await admin.save();

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
