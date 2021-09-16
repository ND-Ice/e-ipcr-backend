const nodemailer = require("nodemailer");

function sendMail(sendTo, id, link, subject, button) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.PASSWORD, // generated ethereal password
    },
  });

  transporter
    .sendMail({
      from: "delacruzjoshua691@gmail.com",
      to: sendTo,
      subject: subject,
      html: `
      <div>
      <h1>Activate you Account</h1>
      <a target="_blank" href="${link}/${id}">${button}</a>
      </div>`,
    })
    .then(() => console.log("email sent"))
    .catch((err) => console.log(err));
}

module.exports = sendMail;
