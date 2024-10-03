const express = require("express");

const app = express();
app.set("view engine", "pug");

const getRaccoonFact = async function (apiVersion) {
  const url = `https://versioned-api.onrender.com/v${apiVersion}/fact/`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

app.get("/", async function (req, res) {
  const apiVersion = 0;

  const raccoonFact = await getRaccoonFact(apiVersion);
  res.render("index.pug", { raccoonFact, apiVersion });
});

const port = 3000;
const server = app.listen(port, function (err) {
  if (err) console.log("Error in server setup");
  console.log(`Server listening on http://localhost:${port}`);
});
