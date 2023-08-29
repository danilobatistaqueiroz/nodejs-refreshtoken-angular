const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const https = require("https");
const fs = require("fs");
require("express-async-errors");

dotenv.config({path:"./config.env"}); 

require("./db-conn");

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET","HEAD","PUT","PATCH","POST","DELETE"],
  preflightContinue: true,
  allowedHeaders: ["Content-Type", "Authorization", 'x-tfa'],
  redirect: "follow",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  credentials: true 
}));

app.use(express.json());
app.use(cookieParser())

const logger = require('./common/logger');

const routes = require("./routes");
app.use(routes);
app.use((err, req, res, next) => {
  var stack = err.stack
  logger.error(String(stack));
  res.status(500).json({message:"Something's gone wrong!"});
});

if(process.env.USE_HTTPS==="true"){
  https.createServer(
      {
        key: fs.readFileSync("./ssl/key.pem","utf8"),
        cert: fs.readFileSync("./ssl/cert.pem","utf8"),
      },
      app
    ).listen(process.env.PORT, () => {
      logger.info(`The server started running on https://localhost:${process.env.PORT}`);
  });
} else {
  app.listen(process.env.PORT, () => {
    logger.info(`The server started running on http://localhost:${process.env.PORT}`);
  });
}
