const { generateTicketAndSendEmail } = require("../ticket-gen/onlineSaleApp");
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

      console.log("TRANSACTION STATUS:", data.status);

      if (data.status === "approved") {
        const orderNumber = Number(data.order_number);

        // Retrieve ticketInfo from the map
        const ticketInfo = ticketInfoMap.get(orderNumber);

        // Check if ticketInfo exists
        if (ticketInfo) {
          // Remove the entry from the map
          ticketInfoMap.delete(orderNumber);
          // Update order number in ticketInfo
          ticketInfo.order_number = orderNumber;

          await updateCategoryAmount(
            ticketInfo.concertData._id,
            ticketInfo.ticketGenData.ticketList
          );
          res.status(200).redirect("https://event.ba/thankyou");
          await updateUserBuyHistory(ticketInfo);
          await generateTicketAndSendEmail(ticketInfo);

          // Return a JSON response with a success message
        } else {
          console.log("No ticketInfo");
          // Return a JSON response with an error message
          res.status(404).redirect("https://event.ba/failed");
        }
      } else {
        // Failed payment
        console.log("Neuspješna kupovina");
        // Return a JSON response with an error message
        res.status(400).redirect("https://event.ba/failed");
      }
    }
  } catch (error) {
    console.error(error);
    // Return a status code of 500 for server errors
    res.status(500).redirect("https://event.ba/failed");
  }
};

const handleTicketData = async (req, res) => {
  try {
    const orderNumber = req.body.orderNumber; // Getting order number
    const ticketInfo = req.body; // Get ticket info from the request body
    // Store the ticket info in the map using the user ID as the key
    ticketInfoMap.set(orderNumber, ticketInfo);

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
