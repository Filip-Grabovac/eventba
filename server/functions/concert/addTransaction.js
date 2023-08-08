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

    // Update the concert document to add transaction data to the specified reseller
    const updateResult = await Concert.updateOne(
      {
        _id: concertId,
        "tickets.free_sale.resellers.reseller_id.$oid": resellerId,
      },
      {
        $push: {
          "tickets.free_sale.resellers.$.transactions": transactionData,
        },
      }
    );

    if (updateResult.nModified === 0) {
      console.error("Concert or Reseller not found");
      return;
    }

    console.log("Reseller information updated successfully");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

module.exports = addTransactionController;
