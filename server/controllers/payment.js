const getPaymentInfo = async (req, res) => {
  try {
    const { transaction_response } = req.body;

    if (transaction_response) {
      const data = JSON.parse(transaction_response);

      if (data.status === "approved") {
        // Successfull payment
        res.redirect("/thankyou");
      } else {
        // Failed payment
        res.redirect("/failed");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Došlo je do greške." });
  }
};

module.exports = {
  getPaymentInfo,
};
