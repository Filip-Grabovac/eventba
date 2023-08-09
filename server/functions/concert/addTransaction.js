const mongoose = require("mongoose");
const connectDB = require("../../db/connect");
const concertSchema = require("../../models/Concert");

async function addTransactionController(
  transactionData,
  resellerId,
  concertId
) {
  try {
    const Concert = connectDB(process.env.DATABASE_URL).model(
      "Concert",
      concertSchema,
      "concerts"
    );

    const resellerObjectId = mongoose.Types.ObjectId(resellerId);
    const concertObjectId = mongoose.Types.ObjectId(concertId);

    // Find the concert and reseller
    const concert = await Concert.findOne({
      _id: concertObjectId,
      "tickets.free_sale.resellers.reseller_id": resellerObjectId,
    });

    if (!concert) {
      console.error("Concert or Reseller not found");
      return;
    }

    const reseller = concert.tickets.free_sale.resellers.find((reseller) =>
      reseller.reseller_id.equals(resellerObjectId)
    );

    // Update the concert document to add transaction data to the specified reseller
    await Concert.updateOne(
      {
        _id: concertObjectId,
        "tickets.free_sale.resellers.reseller_id": resellerObjectId,
      },
      {
        $set: {
          "tickets.free_sale.resellers.$.transactions": [
            ...(reseller.transactions || []), // Add existing transactions if any
            transactionData,
          ],
        },
      }
    );

    console.log("Reseller information updated successfully");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

module.exports = addTransactionController;
