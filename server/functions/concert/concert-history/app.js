const express = require("express");
const app = express();
const port = 5555;

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Serve static files (CSS)
app.use(express.static(__dirname + "/public"));

// Define a route to render the EJS template
app.get("/", (req, res) => {
  // Format the time_of_event and current date
  res.render(__dirname + "/views/eventHistory.ejs", { data });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
