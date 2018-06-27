require("dotenv").config();
const express = require("express");
const path = require("path");
const request = require("request");
const Log4js = require("log4js");

const { name, version } = require("./package.json");
const app = express();

Log4js.configure("./log4js.json");
const logger = Log4js.getLogger("app");

const PORT = process.env.PORT;
const API = process.env.API;
if (!PORT || !API) {
  logger.error("Env variables PORT and API are required to start the server!");
  process.exit(0);
}

app.use(Log4js.connectLogger(logger, { level: "debug" }));
app.use("/", express.static(path.join(__dirname, "apps/app1")));
app.use("/app2", express.static(path.join(__dirname, "apps/app2")));

app.get("/api/*", (req, res) =>
  req.pipe(request.get(`${API}${req.originalUrl}`)).pipe(res)
);
app.post("/api/*", (req, res) =>
  req.pipe(request.post(`${API}${req.originalUrl}`)).pipe(res)
);

app.get("*", (req, res) => res.sendFile(path.join(__dirname, "./404.html")));

app.listen(PORT);

logger.info(`${name}-${version}: started on port ${PORT}/ API ${API}`);
