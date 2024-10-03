const express = require("express");
const path = require("path");
const serveStatic = require("serve-static");

// add these new dependencies
const ld = require("@launchdarkly/node-server-sdk");
require("dotenv").config();

const app = express();
app.set("view engine", "pug");

const sdkKey = process.env.LAUNCHDARKLY_SDK_KEY;
const ldClient = ld.init(sdkKey);

const getRaccoonFact = async function (apiVersion) {
  const url = `https://versioned-api.onrender.com/v${apiVersion}/fact/`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

app.get("/", async function (req, res) {
  const context = {
    kind: "user",
    key: "user-key-123abcde",
    email: "raccacoonie@everything.pizza",
  };
  const apiVersion = await ldClient.variation(
    "raccoon-api_version",
    context,
    0
  );

  const raccoonFact = await getRaccoonFact(apiVersion);

  res.render("index.pug", { raccoonFact, apiVersion });
});

const port = 3000;
const server = app.listen(port, function (err) {
  if (err) console.log("Error in server setup");
  console.log(`Server listening on http://localhost:${port}`);
});

// Add this new function to gracefully close the connection to the LaunchDarkly server.
process.on("SIGTERM", () => {
  debug("SIGTERM signal received: closing HTTP server");
  ld.close();
  server.close(() => {
    debug("HTTP server closed");
    ldClient.close();
  });
});
