const { generateTicketAndSendEmail } = require("../ticket-gen/app");
const { updateCategoryAmount } = require("../controllers/concCheckandUpdate");
const updateUserBuyHistory = require("../functions/user/updateUserBuyHistory");

const ticketInfoMap = new Map();
const requestQueue = []; // Array to store the requests

// Function to process the requests in the queue
const processQueue = async () => {
  // Check if there are any requests in the queue
  if (requestQueue.length > 0) {
    const request = requestQueue[0]; // Get the first request from the queue

    try {
      await handlePaymentEndpoint(request.req, request.res); // Process the request

      // Remove the processed request from the queue
      requestQueue.shift();

      // Process the next request in the queue
      processQueue();
    } catch (error) {
      console.error(`Error processing request: ${error}`);

      // Handle the error if needed

      // Proceed to the next request in the queue
      processQueue();
    }
  }
};

const handlePaymentEndpoint = async (req, res) => {
  try {
    const { transaction_response } = req.body;
    if (transaction_response) {
      const data = JSON.parse(transaction_response);

      if (data.status === "approved") {
        const ticketInfo = ticketInfoMap.get(Number(data.order_number));

        if (ticketInfo) {
          await updateCategoryAmount(
            ticketInfo.concertData._id,
            ticketInfo.ticketGenData.ticketList
          );
          await updateUserBuyHistory(ticketInfo);
          await generateTicketAndSendEmail(ticketInfo);
          res.redirect("/thankyou");
        } else {
          res.redirect("/failed");
        }
      } else {
        // Failed payment
        res.redirect("/failed");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error:
        "MONRI payment service is currently unavailable. Please try again later.",
    });
  }
};

const handleTicketData = async (req, res) => {
  try {
    const orderNumber = req.body.orderNumber; // Getting order number
    const ticketInfo = req.body; // Get ticket info from the request body
    // Store the ticket info in the map using the user ID as the key
    ticketInfoMap.set(orderNumber, ticketInfo);

    console.log(ticketInfoMap);
    res.status(200).json(ticketInfo);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

// Add a middleware function to push requests into the queue
const queueMiddleware = (req, res, next) => {
  requestQueue.push({ req, res }); // Push the request into the queue
  if (requestQueue.length === 1) {
    processQueue(); // Start processing the queue if it was empty
  }
};

module.exports = {
  handlePaymentEndpoint: queueMiddleware,
  handleTicketData,
};
