const handlePaymentEndpoint = async (req, res) => {
  try {
    const { transaction_response, payment_data } = req.body;
    const endpoint = req.originalUrl;

    if (endpoint === "/api/v1/payment/get_payment_info") {
      if (transaction_response) {
        const data = JSON.parse(transaction_response);

        if (data.status === "approved") {
          // Successful payment
          res.redirect("/thankyou");
        } else {
          // Failed payment
          res.redirect("/failed");
        }
      }
    } else if (endpoint === "/api/v1/payment/get_event_data") {
      if (payment_data) {
        console.log(payment_data);
      }
    } else {
      res.status(404).json({ error: "Invalid endpoint" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Došlo je do greške." });
  }
};

module.exports = {
  handlePaymentEndpoint,
};
