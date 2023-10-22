const Decrypt = require("../functions/decrypt");
const User = require("../models/User");

const handleLogin = async (req, res) => {
  try {
    const { password, email } = req.body;
    console.log(req.body);
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ error: `Ne postoji korisnik s ovim email-om: ${email}` });
    }
    const dbPassDecrypted = Decrypt(user.password, process.env.SECRET_KEY);
    if (dbPassDecrypted === password) {
      return res.status(200).json({
        success: "Uspješna prijava",
        id: user._id,
        is_banned: user.is_banned,
      });
    } else {
      return res.status(401).json({ error: "Lozinka nije ispravna" });
    }
  } catch (error) {
    return res.status(500).json({
      error: "Došlo je do greške na serveru, molimo pokušajte kasnije",
    });
  }
};

module.exports = handleLogin;
