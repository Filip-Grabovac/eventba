const express = require("express");
const path = require("path");
const mime = require("mime-types");
const { generatePdfAndSendEmail } = require("./controllers/generatePdf");

async function regenTicket({
  ticketGenData,
  concertData,
  serialNumber,
  ticketNumber,
}) {
  const { price, name, lname, category, row, seat, ticketName, email } =
    ticketGenData;

  const sponsors = concertData.sponsors.map((sponsor) => `sponsors/${sponsor}`);
  const date = new Date(concertData.time_of_event).toLocaleString("hr-HR", {
    weekday: "long", // Adds the name of the day
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: "Europe/Zagreb",
  });
  const formattedDate = date.charAt(0).toUpperCase() + date.slice(1);

  // Create a new ticket document

  const port = 33333;

  // Create a new Express app instance for the current ticket
  const app = express();

  // Serve static files with the correct MIME type
  app.use(
    express.static(path.join(__dirname, "public"), {
      setHeaders: (res, filePath) => {
        const contentType = mime.lookup(filePath);
        if (contentType === "text/css") {
          res.setHeader("Content-Type", contentType);
        }
      },
    })
  );

  // Set the view engine to EJS
  app.set("view engine", "ejs");

  // Set the views directory
  app.set("views", path.join(__dirname, "template"));

  // Define a route for the root URL ("/")
  app.get("/", (req, res) => {
    // Render the "index.ejs" file as the response
    res.render("onlineSale", {
      serialNumber,
      place: `
      ${concertData.place.place}, ${concertData.place.city}, ${concertData.place.country}`,
      price,
      name,
      lname,
      category,
      seat,
      row,
      ticketName,
      formattedDate,
      concertData,
      posterRoutePortrait: `event-images/${concertData.poster.portrait}`,
      posterRouteLandscape: `event-images/${concertData.poster.landscape}`,
      sponsors,
      ticketNumber,
    });
  });
  console.log(`Working on ${serialNumber} ${concertData.performer_name}`);
  // Start the server for the current ticket
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  // Generate and send PDF email for the current ticket
  const performerName = concertData.performer_name;
  const dataForEmail = { name, lname, price, category, performerName };
  // Generate and send PDF email for the current ticket
  await generatePdfAndSendEmail(email, port, dataForEmail);
  console.log("Ended");
}

const serialNumber = "64fefd31bcd4b12111f9fc81";
const ticketGenData = {
  price: 10,
  name: "Ivica",
  lname: "Džambas",
  category: "Tribina",
  row: "",
  seat: "",
  ticketName: "Regular",
  email: "13kreso@gmail.com",
};

const concertData = {
  _id: {
    $oid: "64e926b904c6106bef127185",
  },
  tickets: {
    online_sale: {
      total_amount_left: 298,
      sold_amount: 2,
      amount_inBAM: 20,
      zones: {
        Tribina: {
          amount: 298,
          max_amount: 300,
          name: "Regular",
          price: 10,
        },
      },
    },
    free_sale: {
      total_amount_left: 1600,
      sold_amount: 0,
      amount_inBAM: 0,
      total_loaned: 0,
      resellers: [],
      zones: {
        Tribina: {
          amount: 1500,
          max_amount: 1500,
          loaned: 0,
          price: 10,
          name: "Regular",
        },
        VIP: {
          amount: 100,
          max_amount: 100,
          price: 20,
          name: "VIP",
          loaned: 0,
        },
      },
    },
  },
  place: {
    type: "hall",
    country: "BiH",
    city: "Novi Travnik",
    place: "Sportska Dvorana",
  },
  type: ["concert", "suggested"],
  sponsors: [],
  is_promoted_event: true,
  performer_name: "Alan Hržica",
  poster: {
    landscape: "1693001411041_331_landscape.jpg",
    portrait: "1693001411041_199_portrait.jpg",
  },
  tickets_yesterday: {
    online_sale: {
      total_amount_left: 0,
      sold_amount: 0,
      amount_inBAM: 0,
    },
    free_sale: {
      total_amount_left: 1600,
      sold_amount: 0,
      amount_inBAM: 0,
      total_loaned: 0,
      resellers: [],
    },
  },
  time_of_event: "2023-09-23T17:30:00.000Z",
  description: "Koncert duhovne glazbe ",
  organizer: {
    $oid: "64e0ae60dddf981c14acdbd9",
  },
  __v: 1,
  verified: true,
  concert_history: [
    {
      date: {
        $date: "2023-08-26T23:00:01.000Z",
      },
      tickets: {
        free_sale: {
          resellers: [],
        },
      },
    },
    {
      date: {
        $date: "2023-08-27T23:00:00.917Z",
      },
      tickets: {
        free_sale: {
          resellers: [],
        },
      },
    },
    {
      date: {
        $date: "2023-08-28T23:00:00.388Z",
      },
      tickets: {
        free_sale: {
          resellers: [],
        },
      },
    },
    {
      date: {
        $date: "2023-08-29T23:00:00.507Z",
      },
      tickets: {
        free_sale: {
          resellers: [],
        },
      },
    },
    {
      date: {
        $date: "2023-08-30T23:00:00.419Z",
      },
      tickets: {
        free_sale: {
          resellers: [],
        },
      },
    },
    {
      date: {
        $date: "2023-08-31T23:00:00.491Z",
      },
      tickets: {
        free_sale: {
          resellers: [],
        },
      },
    },
    {
      date: {
        $date: "2023-09-01T23:00:00.471Z",
      },
      tickets: {
        free_sale: {
          resellers: [],
        },
      },
    },
    {
      date: {
        $date: "2023-09-01T23:00:01.181Z",
      },
      tickets: {
        free_sale: {
          resellers: [],
        },
      },
    },
    {
      date: {
        $date: "2023-09-01T23:00:00.201Z",
      },
      tickets: {
        free_sale: {
          resellers: [],
        },
      },
    },
    {
      date: {
        $date: "2023-09-02T23:00:00.605Z",
      },
      tickets: {
        free_sale: {
          resellers: [],
        },
      },
    },
    {
      date: {
        $date: "2023-09-03T23:00:00.150Z",
      },
      tickets: {
        free_sale: {
          resellers: [],
        },
      },
    },
    {
      date: {
        $date: "2023-09-04T23:00:00.839Z",
      },
      tickets: {
        free_sale: {
          resellers: [],
        },
      },
    },
    {
      date: {
        $date: "2023-09-05T23:00:00.088Z",
      },
      tickets: {
        free_sale: {
          resellers: [],
        },
      },
    },
    {
      date: {
        $date: "2023-09-06T23:00:00.464Z",
      },
      tickets: {
        free_sale: {
          resellers: [],
        },
      },
    },
    {
      date: {
        $date: "2023-09-07T23:00:00.269Z",
      },
      tickets: {
        free_sale: {
          resellers: [],
        },
      },
    },
    {
      date: {
        $date: "2023-09-08T23:00:00.236Z",
      },
      tickets: {
        free_sale: {
          resellers: [],
        },
      },
    },
    {
      date: {
        $date: "2023-09-09T23:00:00.627Z",
      },
      tickets: {
        free_sale: {
          resellers: [],
        },
      },
    },
  ],
};

const ticketNumber = "N001602";
const tickeRegenData = {
  ticketGenData,
  concertData,
  serialNumber,
  ticketNumber,
};
regenTicket(tickeRegenData);
