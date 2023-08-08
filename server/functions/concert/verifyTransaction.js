const mongoose = require("mongoose");
const connectDB = require("../../db/connect");
const concertSchema = require("../../models/Concert");

async function verifyTransactionController(
  transactionIndex,
  concertId,
  resellerId
) {
  try {
    const Concert = connectDB(process.env.DATABASE_URL).model(
      "Concert",
      concertSchema,
      "concerts"
    );

    const resellerObjectId = mongoose.Types.ObjectId(resellerId);
    const concertObjectId = mongoose.Types.ObjectId(concertId);

    const updateResult = await Concert.updateOne(
      {
        _id: concertObjectId,
        "tickets.free_sale.resellers.reseller_id": resellerObjectId,
      },
      {
        $set: {
          [`tickets.free_sale.resellers.$[reseller].transactions.${transactionIndex}.is_verified`]: true,
        },
      },
      {
        arrayFilters: [
          { "reseller.reseller_id": resellerObjectId },
          { transactionIndex: transactionIndex },
        ],
      }
    );

    if (updateResult.nModified === 0) {
      console.error("Concert, Reseller, or Transaction not found");
      return;
    }

    console.log("Transaction verification successful");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

module.exports = verifyTransactionController;
