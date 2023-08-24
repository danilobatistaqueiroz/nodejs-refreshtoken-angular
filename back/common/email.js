const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: 'lolita72@ethereal.email',
    pass: 'DHve3mrGSt4wpgT7Fv'
  }
});

async function send(to,code) {
  const info = await transporter.sendMail({
    from: '"LabsCO 👻" <lolita72@ethereal.email>', 
    to: to,
    subject: "Confirm your account in LabsCO ✔", 
    text: `Hello and Wellcome to LabsCO, you need to confirm your new account! Enter in http://localhost:3000/user/confirm?code=${code} to confirm`, 
    html: `<b>Hello and Wellcome to LabsCO, you need to confirm your new account! Click here:</b><a href='http://localhost:3000/user/confirm?code=${code}'>confirm</a>`,
  });
}

module.exports = { send };