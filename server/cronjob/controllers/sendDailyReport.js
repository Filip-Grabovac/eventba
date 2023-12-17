const Helper = require("../../models/Helper");

const sendSummaryMail = require("./sendSummaryMailFunc");
const sendDailyReport = async () => {
  try {
    // Find the document with a "daily_sales" property
    const helperDoc = await Helper.findOne({ daily_sales: { $exists: true } });

    if (helperDoc) {
      const dailySalesArray = helperDoc.daily_sales;

      // Initialize a dictionary to store the summarized data
      const eventSummary = {};

      // Initialize global totals
      let totalSoldAmount = 0;
      let totalInBAM = 0;

      // Loop through the daily_sales array
      for (const sale of dailySalesArray) {
        const { concert, performer_name, date, zone, price } = sale;

        // Ensure the date is a valid Date object
        const saleDate = new Date(date);
        if (isNaN(saleDate.getTime())) {
          console.error(`Invalid date format for sale: ${sale}`);
          continue; // Skip this sale and proceed to the next one
        }

        // Ensure the formatDate function is defined
        const formattedDate = formatDate(saleDate);

        // If the event is not already in the summary dictionary, initialize it
        if (!eventSummary[concert]) {
          eventSummary[concert] = {
            performer_name,
            formattedDate,
            categories: {}, // Initialize categories as an empty object
            totalSoldAmount: 0,
            totalInBAM: 0,
          };
        }

        // If the zone is not already in the event summary categories, initialize it
        if (!eventSummary[concert].categories[zone]) {
          eventSummary[concert].categories[zone] = {
            sold_amount: 0,
            inBAM: 0,
          };
        }

        // Update the event summary with the current sale data
        eventSummary[concert].categories[zone].sold_amount += 1;
        eventSummary[concert].categories[zone].inBAM += price;

        // Update the total values for the event
        eventSummary[concert].totalSoldAmount += 1;
        eventSummary[concert].totalInBAM += price;

        // Update global totals
        totalSoldAmount += 1;
        totalInBAM += price;
      }

      // Now eventSummary contains the summarized data for each event and zone

      // You can further process or use eventSummary as needed
      sendSummaryMail(
        "info@event.ba",
        eventSummary,
        totalSoldAmount,
        totalInBAM
      );

      await Helper.updateOne(
        { _id: helperDoc._id },
        { $set: { daily_sales: [] } }
      );
    } else {
      console.log("No document found with daily_sales property");
    }
  } catch (error) {
    console.error("Error while retrieving daily_sales:", error);
  }
};

function formatDate(date) {
  return date.toLocaleString("hr-HR", {
    weekday: "long", // Adds the name of the day
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: "Europe/Zagreb",
  });
}

module.exports = sendDailyReport;
