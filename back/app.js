const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const https = require("https");
const fs = require("fs");

dotenv.config({path:"./config.env"}); 

require("./conn");

const login = require("./routes/login");
const register = require("./routes/register");
const tfa = require("./routes/tfa");
const user = require("./routes/user");
const admin = require("./routes/admin");

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET","HEAD","PUT","PATCH","POST","DELETE"],
  preflightContinue: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  redirect: "follow",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  credentials: true 
}));

if(process.env.USE_HTTPS==="true"){
  https.createServer(
      {
        key: fs.readFileSync("./ssl/key.pem","utf8"),
        cert: fs.readFileSync("./ssl/cert.pem","utf8"),
      },
      app
    ).listen(process.env.PORT, () => {
      console.log(`The server started running on https://localhost:${process.env.PORT}`);
  });
} else {
  app.listen(process.env.PORT, () => {
    console.log(`The server started running on http://localhost:${process.env.PORT}`);
  });
}

app.use(bodyParser.json());
app.use(cookieParser())

app.use(login);
app.use(register);
app.use(tfa);
app.use(user);
app.use(admin);
app.use((error, req, res, next) => {
  res.status(500).json({ error: error.message });
});