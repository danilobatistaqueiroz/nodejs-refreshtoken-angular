const {getAdmins,saveAdmin} = require("./controllers/admin");
const {login} = require("./controllers/login");
const {register} = require("./controllers/register");
const {passwordResetRequest, passwordReset} = require("./controllers/password-reset");
const {isAdminAuthenticated, isUserAuthenticated} = require("./middlewares/auth");
const {generateTfa,getTfa,enableLoginUsingTfa,disableLoginUsingTfa} = require("./controllers/tfa");
const {getUser,getUserTfa,confirmUser,getInfo} = require("./controllers/user");
const {refreshToken} = require("./controllers/refresh-token");
const express = require("express");
const router = express.Router();

//TODO: finalizar
router.get("/admin", isAdminAuthenticated, getAdmins);

router.post("/admin", isAdminAuthenticated, saveAdmin);

router.post("/auth/login", login);

router.post("/auth/register", register);

router.post("/auth/refresh-token", refreshToken);

router.post("/password/reset-request", passwordResetRequest);

router.post("/password/reset", passwordReset);

router.post("/tfa", isUserAuthenticated, generateTfa);

router.get("/tfa", getTfa);

router.post("/tfa/enable", enableLoginUsingTfa);

router.post("/tfa/disable", disableLoginUsingTfa);

router.get("/user", getUser);

router.get("/user/tfa", getUserTfa);

router.get("/user/confirm", confirmUser);

module.exports = router;