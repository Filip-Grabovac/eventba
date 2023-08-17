const express = require("express");
const app = express();
const port = 5555;
const { format } = require("date-fns");
const data = {
  _id: {
    $oid: "64d40582b31d92249499a98d",
  },
  place: {
    type: "hall",
    country: "Bosna i Hercegovina",
    city: "Gornji Vakuf - Uskoplje",
    place: "Dvorana Pajić Polje",
  },
  performer_name: "Prljavo Kazalište",

  time_of_event: {
    $date: "2023-08-15T21:30:00.000Z",
  },
  concertHistory: [
    {
      date: "2023-08-13T13:10:23.071Z",
      tickets: {
        free_sale: {
          total_amount: 261,
          amount_inBAM: 35,
          total_loaned: 14,
          sold_amount: 2,
          resellers: [
            {
              reseller_name: "Avatar",
              reseller_address: "Uskoplje, Gradska ulica",
              reseller_id: {
                $oid: "64abec44437ec5030c423547",
              },
              type: {
                "Kategorija 1": {
                  loaned: 2,
                  name: "Parter",
                  price: 15,
                  sold: 1,
                },
                "Kategorija 2": {
                  loaned: 2,
                  name: "Tribina",
                  price: 20,
                  sold: 1,
                },
              },
              transactions: [
                {
                  reseller: "Filip Mali",
                  date: "Wed Aug 09 2023 23:42:27 GMT+0200 (Central European Summer Time)",
                  taker: "Krešo",
                  price: 10,
                  is_verified: true,
                },
              ],
            },
            {
              reseller_name: "Infinity",
              reseller_address: "Uskoplje, Vrbaska",
              reseller_id: {
                $oid: "64c4d435c67b4d2a3068e305",
              },
              type: {
                "Kategorija 1": {
                  loaned: 1,
                  name: "Parter",
                  price: 15,
                  sold: 0,
                },
                "Kategorija 2": {
                  loaned: 9,
                  name: "Tribina",
                  price: 20,
                  sold: 0,
                },
              },
            },
          ],
          type: {
            "Kategorija 1": {
              amount: 122,
              maxAmount: 123,
              price: 15,
              name: "Parter",
              loaned: 3,
            },
            "Kategorija 2": {
              amount: 85,
              maxAmount: 86,
              price: 20,
              name: "Tribina",
              loaned: 11,
            },
            "Kategorija 3": {
              amount: 49,
              maxAmount: 49,
              price: 30,
              name: "VIP",
              loaned: 0,
            },
            "Kategorija 4": {
              amount: 5,
              maxAmount: 5,
              price: 50,
              name: "Super VIP",
              loaned: 0,
            },
          },
        },
        online_sale: {
          total_amount: 1983,
          type: {
            "Kategorija 1": {
              amount: 1988,
              maxAmount: 2000,
              price: 10,
              name: "Parter",
            },
            "Kategorija 2": {
              amount: 1995,
              maxAmount: 2000,
              price: 15,
              name: "Tribina",
            },
          },
          sold_amount: 17,
          amount_inBAM: 195,
        },
      },
    },
    {
      date: "2023-08-14T13:10:23.071Z",
      tickets: {
        free_sale: {
          total_amount: 261,
          amount_inBAM: 35,
          total_loaned: 14,
          sold_amount: 2,
          resellers: [
            {
              reseller_name: "Avatar",
              reseller_address: "Uskoplje, Gradska ulica",
              reseller_id: {
                $oid: "64abec44437ec5030c423547",
              },
              type: {
                "Kategorija 1": {
                  loaned: 2,
                  name: "Parter",
                  price: 15,
                  sold: 1,
                },
                "Kategorija 2": {
                  loaned: 2,
                  name: "Tribina",
                  price: 20,
                  sold: 1,
                },
              },
              transactions: [
                {
                  reseller: "Filip Mali",
                  date: "Wed Aug 09 2023 23:42:27 GMT+0200 (Central European Summer Time)",
                  taker: "Krešo",
                  price: 10,
                  is_verified: true,
                },
              ],
            },
            {
              reseller_name: "Infinity",
              reseller_address: "Uskoplje, Vrbaska",
              reseller_id: {
                $oid: "64c4d435c67b4d2a3068e305",
              },
              type: {
                "Kategorija 1": {
                  loaned: 1,
                  name: "Parter",
                  price: 15,
                  sold: 0,
                },
                "Kategorija 2": {
                  loaned: 9,
                  name: "Tribina",
                  price: 20,
                  sold: 0,
                },
              },
            },
          ],
          type: {
            "Kategorija 1": {
              amount: 122,
              maxAmount: 123,
              price: 15,
              name: "Parter",
              loaned: 3,
            },
            "Kategorija 2": {
              amount: 85,
              maxAmount: 86,
              price: 20,
              name: "Tribina",
              loaned: 11,
            },
            "Kategorija 3": {
              amount: 49,
              maxAmount: 49,
              price: 30,
              name: "VIP",
              loaned: 0,
            },
            "Kategorija 4": {
              amount: 5,
              maxAmount: 5,
              price: 50,
              name: "Super VIP",
              loaned: 0,
            },
          },
        },
        online_sale: {
          total_amount: 1978,
          type: {
            "Kategorija 1": {
              amount: 1988,
              maxAmount: 2000,
              price: 10,
              name: "Parter",
            },
            "Kategorija 2": {
              amount: 1990,
              maxAmount: 2000,
              price: 15,
              name: "Tribina",
            },
          },
          sold_amount: 22,
          amount_inBAM: 270,
        },
      },
    },
  ],
  __v: 3,
};
// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Serve static files (CSS)
app.use(express.static(__dirname + "/public"));

// Define a route to render the EJS template
app.get("/", (req, res) => {
  // Format the time_of_event and current date
  const formattedTimeOfEvent = format(
    new Date(data.time_of_event.$date),
    "dd.MM.yyyy HH:mm"
  );
  const currentDate = format(new Date(), "dd.MM.yyyy");
  res.render(__dirname + "/views/eventHistory.ejs", {
    data,
    formattedTimeOfEvent,
    currentDate,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
