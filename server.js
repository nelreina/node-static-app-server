require("dotenv").config();
const express = require("express");
const path = require("path");
const Log4js = require("log4js");
const proxy = require("http-proxy-middleware");

const { name, version } = require("./package.json");
const app = express();

Log4js.configure("./log4js.json");
const logger = Log4js.getLogger("app");

const PORT = process.env.WEB_PORT;
const API = `http://${process.env.API_HOST}:${process.env.API_PORT}`;
const WS = `ws://${process.env.API_HOST}:${process.env.API_PORT}`;
if (!PORT || !API) {
  logger.error("Env variables PORT and API are required to start the server!");
  process.exit(0);
}

app.use(Log4js.connectLogger(logger, { level: "debug" }));
app.use("/", express.static(path.join(__dirname, "apps/app1")));
app.use("/app2", express.static(path.join(__dirname, "apps/app2")));

app.use("/api", proxy(`${API}/api`));
app.use("/socket.io", proxy(`${WS}`, { ws: true }));

app.get("*", (req, res) => res.sendFile(path.join(__dirname, "./404.html")));

app.listen(PORT);

logger.info(`${name}-${version}: started on port ${PORT}/ API ${API}`);
