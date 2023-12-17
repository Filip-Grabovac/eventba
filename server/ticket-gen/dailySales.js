// Import the Helper model
const Helper = require("../models/Helper");

async function dailySales(ticketInfo) {
  try {
    // Find the document with a "daily_sales" property
    const docWithDailySales = await Helper.findOne({
      daily_sales: { $exists: true },
    });

    if (docWithDailySales) {
      // If the document exists, update the "daily_sales" property
      const updateQuery = { $push: { daily_sales: { $each: [ticketInfo] } } };
      await Helper.updateOne({ _id: docWithDailySales._id }, updateQuery);
    } else {
      // If the document doesn't exist, create a new one
      const newDoc = await new Helper({ daily_sales: [ticketInfo] }).save();
      console.log("New Helper document created:", newDoc);
    }
  } catch (error) {
    console.log({ msg: error });
  }
}

module.exports = { dailySales };
