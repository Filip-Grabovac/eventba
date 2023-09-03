async function updateConcertFunc(req, res, Concert) {
  const { concertId } = req.params;
  const { total_amount, price, reseller_id, category_name } = req.body;
  let updatedTotalAmount,
    updatedSoldAmount,
    updatedAmountInBAM,
    updatedOverallCategory;

  try {
    // Find the concert with "_id" property matching the concertId
    const concert = await Concert.findById({ _id: concertId });

    if (!concert) {
      return res.status(404).json({ message: "Koncert nije pronađen." });
    }

    // Access the "free_sale" and "total_amount" properties in the tickets
    const { free_sale } = concert.tickets;

    const {
      total_amount_left: currentTotalAmount,
      sold_amount,
      amount_inBAM,
      resellers,
    } = free_sale;

    // Find the reseller in the "resellers" array with the matching "reseller_id"
    const targetReseller = resellers.find(
      (reseller) => reseller.reseller_id == reseller_id
    );
    const targetResellerIndex = resellers.findIndex(
      (reseller) => reseller.reseller_id == reseller_id
    );

    if (!targetReseller) {
      return res
        .status(400)
        .json({ message: "Preprodavač sa ovim id nije pronađen." });
    }

    // Find the category object with the matching "category_name" inside the "type" object
    const targetCategory = targetReseller.zones[category_name];
    const targetOverallCategory =
      concert.tickets.free_sale.zones[category_name];
    let soldAmount = targetCategory.sold;

    if (total_amount_left === "-") {
      updatedTotalAmount = currentTotalAmount - 1;
      updatedSoldAmount = sold_amount + 1;
      updatedAmountInBAM = amount_inBAM + price;
      soldAmount += 1;
      updatedOverallCategory = targetOverallCategory.amount - 1;
    } else if (total_amount_left === "+") {
      updatedTotalAmount = currentTotalAmount + 1;
      updatedSoldAmount = sold_amount - 1;
      updatedAmountInBAM = amount_inBAM - price;
      soldAmount -= 1;
      updatedOverallCategory = targetOverallCategory.amount + 1;
    } else {
      return res.status(400).json({
        message: 'Pogrešna total_amount vrijednost. Koristi "+" or "-".',
      });
    }

    // Use updateOne to update the concert in the database
    await Concert.updateOne(
      { _id: concertId },
      {
        $set: {
          "tickets.free_sale.total_amount_left": updatedTotalAmount,
          "tickets.free_sale.sold_amount": updatedSoldAmount,
          "tickets.free_sale.amount_inBAM": updatedAmountInBAM,
          [`tickets.free_sale.resellers.${targetResellerIndex}.zones.${category_name}.sold`]:
            soldAmount,
          [`tickets.free_sale.zones.${category_name}.amount`]:
            updatedOverallCategory,
        },
      },
      { arrayFilters: [{ "reseller.reseller_id": reseller_id }] }
    );

    res.status(200).json({
      message: "Uspješno ažurirano.",
    });
  } catch (err) {
    console.error("Greška pri ažuriranju koncerta:", err);
    res.status(500).json({
      message: "Serverska greška.",
    });
  }
}

module.exports = { updateConcertFunc };
