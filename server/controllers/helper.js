const sendMailWithHyperlink = require("../mailer/mailer");
const Helper = require("../models/Helper");
const User = require("../models/User");

const getSponsorList = async (req, res) => {
  try {
    // Find the document with a "sponsors" property
    const documentWithSponsors = await Helper.findOne({
      sponsors: { $exists: true },
    });

    if (documentWithSponsors) {
      const sponsors = documentWithSponsors.sponsors;
      res.status(200).json(sponsors);
    } else {
      res
        .status(404)
        .json({ msg: 'No document with "sponsors" property found' });
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const updateSponsorList = async (sponsors) => {
  try {
    const newSponsors = sponsors;

    // Find the document with a "sponsors" property
    const query = { sponsors: { $exists: true } };
    const documentWithSponsors = await Helper.findOne(query);

    if (documentWithSponsors) {
      const existingSponsors = documentWithSponsors.sponsors;

      // Remove duplicates from new sponsors
      const uniqueNewSponsors = newSponsors.filter((newSponsor) => {
        return !existingSponsors.includes(newSponsor);
      });

      // Combine existing and new sponsors
      const updatedSponsors = [...existingSponsors, ...uniqueNewSponsors];

      // Update the document's "sponsors" array with the updated array
      const updateQuery = { $set: { sponsors: updatedSponsors } };
      await Helper.updateOne(query, updateQuery);
    } else {
      console.log("No doc with sponsor property");
    }
  } catch (error) {
    console.log({ msg: error });
  }
};

const getHotEvents = async (req, res) => {
  try {
    // Find the document with a "hot_events" property
    const documentWithHotEvents = await Helper.findOne({
      hot_events: { $exists: true },
    });

    if (!documentWithHotEvents) {
      return res
        .status(404)
        .json({ message: 'No document with "hot_events" property found.' });
    }

    const hotEvents = documentWithHotEvents.hot_events;
    res.json(hotEvents);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ message: "An error occurred." });
  }
};

const manageNewsletterSubscription = async (req, res) => {
  try {
    const helperId = "64ec823175ccc834678f4698";
    const userId = req.params.id;
    const { userEmail } = req.body; // Pretpostavljamo da je e-pošta poslana u tijelu zahtjeva

    // Pronađi Helper dokument prema njegovom ID-u
    const helper = await Helper.findById(helperId);

    if (!helper) {
      return res
        .status(404)
        .json({ message: "Dokument pomoćnika nije pronađen." });
    }

    const newsletterArray = helper.newsletter || [];

    const newsletterIndex = newsletterArray.indexOf(userEmail);
    if (newsletterIndex !== -1) {
      // Ako se e-pošta pronađe, ukloni je
      newsletterArray.splice(newsletterIndex, 1);
    } else {
      // Ako se e-pošta ne pronađe, dodaj je
      newsletterArray.push(userEmail);
    }

    // Ažuriraj niz newslettera Helper dokumenta pomoću updateOne
    await Helper.updateOne({ _id: helperId }, { newsletter: newsletterArray });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Korisnik nije pronađen." });
    }

    // Prebaci status pretplate na newsletter
    user.newsletter = !user.newsletter;

    // Ažuriraj status newslettera User dokumenta pomoću updateOne
    await User.updateOne({ _id: userId }, { newsletter: user.newsletter });

    const subscriptionMessage = user.newsletter
      ? "Uspješno ste se pretplatili."
      : "Uspješno ste prekinuli pretplatu.";

    res.status(200).json({
      message: subscriptionMessage,
      user,
    });
  } catch (error) {
    console.error("Dogodila se pogreška:", error);
    res.status(500).json({ message: "Dogodila se pogreška." });
  }
};

const requestPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("Korisnik nije pronađen");
    }

    const currentTime = Date.now();
    const requestDate = user.request_date || 0;
    const timeDifferenceInMinutes = (currentTime - requestDate) / (1000 * 60);

    // if (timeDifferenceInMinutes < 60) {
    //   return res
    //     .status(400)
    //     .send(
    //       `Zahtjev za resetiranje lozinke poslan prije ${Math.floor(
    //         timeDifferenceInMinutes
    //       )} minuta. Molimo sačekajte ${
    //         60 - Math.floor(timeDifferenceInMinutes)
    //       } minuta do novog zahtjeva.`
    //     );
    // }

    user.request_number = currentTime;
    user.request_date = currentTime;
    await user.save();

    const verificationLink = `${process.env.REACT_APP_API_URL_FE}/reset_password/${currentTime}`;

    sendMailWithHyperlink(
      email,
      "Link za regeneraciju lozinke",
      "Kliknite na link za generaciju nove lozinke",
      "link",
      verificationLink
    );

    res.status(200).send(`E-pošta za resetiranje lozinke poslana na ${email}.`);
  } catch (error) {
    console.error("Pogreška pri resetiranju lozinke:", error);
    res.status(500).send("Interna serverska pogreška");
  }
};

const resetPassword = async (req, res) => {
  try {
    const { request_number } = req.params;
    const { encryptedPass } = req.body;

    const existingUserWithCode = await User.findOneAndUpdate(
      { request_number: Number(request_number) },
      { $set: { password: encryptedPass }, $unset: { request_number: "" } },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!existingUserWithCode) {
      return res.status(404).json({
        msg: `Neuspješan pokušaj promjene lozinke. Kod nije važeći: ${request_number}.`,
      });
    }
    res.status(200).json({
      msg: "Uspješno ste promjenili lozinku! Ažurirajte lozinku na svom profilu!",
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Došlo je do greške pri generaciji nove loznike. " });
  }
};

module.exports = {
  requestPassword,
  resetPassword,
  getSponsorList,
  updateSponsorList,
  getHotEvents,
  manageNewsletterSubscription,
};
