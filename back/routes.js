const {getAdmins,saveAdmin} = require("./controllers/admin");
const {login} = require("./controllers/login");
const {register} = require("./controllers/register");
const {passwordResetRequest, passwordReset} = require("./controllers/password-reset");
const {isAdminAuthenticated, isUserAuthenticated} = require("./middlewares/auth");
const {generateTfa,getTfa,verifyTfa,enableLoginUsingTfa} = require("./controllers/tfa");
const {getUser,getUserTfa,confirmUser,getInfo} = require("./controllers/user");
const express = require("express");
const router = express.Router();

router.get("/admin", isAdminAuthenticated, async (req, res) => {
  //TODO: finalizar
  const result = await getAdmins();
  res.status(result.status).json(result);
});

router.post("/admin", isAdminAuthenticated, async (req, res) => {
  const result = await saveAdmin(req);
  res.status(result.status).json(result);
});

router.get("/admin/dashboard", isAdminAuthenticated, async (req, res) => {
  //TODO: gerar a rota no angular para home com base em algo daqui
  res.json({})
});

router.post("/auth/login", async (req, res) => {
  const result = await login(req);
  res.status(result.status).cookie("token",result.token, {httpOnly:true, secure:true}).json({message:result.message});
});

router.post("/auth/register", async (req, res) => {
  const result = await register(req);
  res.status(result.status).cookie({"token":result.token}).json(result.body);
});

router.post("/password/reset-request", async (req, res) => {
  const result = await passwordResetRequest(req);
  res.status(result.status).json(result.message);
});

router.post("/password/reset", async (req, res) => {
  const result = await passwordReset(req);
  res.status(result.status).json(result.message);
});

router.post("/tfa", async (req, res) => {
  const result = await generateTfa(req);
  res.status(result.status).json(result.body);
});

router.get("/tfa", async (req, res) => {
  let tfa = await getTfa(req.query.email);
  res.json({tfa:tfa});
});

router.post("/tfa/enable", async (req, res) => {
  const result = await enableLoginUsingTfa(req,true);
  res.status(result.status).json(result.message);
});

router.post("/tfa/disable", async (req, res) => {
  const result = await enableLoginUsingTfa(req,false);
  res.status(result.status).json(result.message);
});

router.get("/user", async (req, res, next) => {
  const result = await getUser(req);
  res.status(result.status).json(result.body);
});

router.get("/user/tfa", async (req,res)=>{
  const result = await getUserTfa(req);
  res.status(result.status).json(result.body);
});

router.get("/user/confirm", async (req, res) => {
  const result = await confirmUser(req);
  res.status(result.status).json({message:result.message});
});

router.get("/user/home", isUserAuthenticated, async (req, res) => {
  //TODO: gerar a rota no angular para home com base em algo daqui
  res.json({});
});

router.get("/user/info", isUserAuthenticated, async (req, res) => {
  //TODO: gerar informações
  const result = await getInfo();
  res.json();
});

module.exports = router;