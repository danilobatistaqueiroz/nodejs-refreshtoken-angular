const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PWD
  }
});

async function send(email,subject,payload,template) {
  try{
    const source = fs.readFileSync(path.join(__dirname,"./email-templates", template), "utf8");
    const compiledTemplate = handlebars.compile(source);
    const info = await transporter.sendMail({
      from: '"LabsCO 👻" <'+process.env.EMAIL_ADDRESS+'>', 
      to: email,
      subject: subject,
      html: compiledTemplate(payload),
    }, (err, info) => {
      if (err) {
        console.error(err.stack);
      } else {
        return res.status(200).json({
          success: true,
        });
      }
    });
  } catch (err) {
    console.error(err.stack);
  }
}

async function sendConfirmation(name,email,code){
  const subject = "Confirm your account in LabsCO ✔";
  const payload = {name:name,email:email,code:code};
  send(email,subject,payload,"signup-confirmation.handlebars");
}

async function sendPasswordResetRequest(name,email,link){
  const subject = "Password Reset Request";
  const payload = {name:name,link:link};
  send(email,subject,payload,"password-reset-request.handlebars");
}

async function sendPasswordReset(email){
  const subject = "Password Reset";
  send(email,subject,{},"password-reset.handlebars");
}

module.exports = { sendConfirmation, sendPasswordResetRequest, sendPasswordReset };