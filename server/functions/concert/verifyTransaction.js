const connectDB = require("../../db/connect");
const concertSchema = require("../../models/Concert");

async function verifyTransactionController(
  resellerId,
  concertId,
  transactionIndex
) {
  try {
    const Concert = connectDB(process.env.DATABASE_URL).model(
      "Concert",
      concertSchema,
      "concerts"
    );

    // Update the concert document to set is_verified to true for the specified transaction
    const updateResult = await Concert.updateOne(
      {
        _id: concertId,
        "tickets.free_sale.resellers.reseller_id.$oid": resellerId,
        [`tickets.free_sale.resellers.$.transactions.${transactionIndex}.is_verified`]: false,
      },
      {
        $set: {
          [`tickets.free_sale.resellers.$.transactions.${transactionIndex}.is_verified`]: true,
        },
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
