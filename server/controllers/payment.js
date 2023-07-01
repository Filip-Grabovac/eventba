const handlePaymentEndpoint = async (req, res) => {
  try {
    const { transaction_response } = req.body;
    const endpoint = req.originalUrl;
    let ticketInfo = {};

    console.log(endpoint);

    if (endpoint === "/api/v1/payment/get_payment_info") {
      if (transaction_response) {
        const data = JSON.parse(transaction_response);

        if (data.status === "approved") {
          // Successful payment, manipulate with ticketInfo
          res.redirect("/thankyou");
        } else {
          // Failed payment
          res.redirect("/failed");
        }
      }
    } else if (endpoint === "/api/v1/payment/get_event_data") {
      ticketInfo = req.body;
      res.status(200).json(req.body); // Send payment_data as the response
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
