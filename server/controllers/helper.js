const Helper = require("../models/Helper");

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

module.exports = { getSponsorList, updateSponsorList };
