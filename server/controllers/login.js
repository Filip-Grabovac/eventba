const jwt = require("jsonwebtoken");
const Decrypt = require("../functions/decrypt");
const User = require("../models/User");

const handleLogin = async (req, res) => {
  try {
    const { password, email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: `Korisnik s ovim email-om ne postoji: ${email}` });
    }

    const dbPassDecrypted = Decrypt(user.password, process.env.SECRET_KEY);

    if (dbPassDecrypted === password) {
      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );

      return res.status(200).json({
        success: "Uspješna prijava",
        id: user._id,
        is_banned: user.is_banned,
        token, // Include the generated JWT in the response
      });
    } else {
      return res.status(401).json({ message: "Neispravna lozinka" });
    }
  } catch (error) {
    return res.status(500).json({
      error: "Došlo je do greške na serveru, molimo pokušajte kasnije",
    });
  }
};

module.exports = handleLogin;
