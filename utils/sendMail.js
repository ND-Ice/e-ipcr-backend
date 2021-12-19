const nodemailer = require("nodemailer");
const getEmailStructured = require("./getEmailStructured");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

async function sendMail(recipient, link, heading, title, id) {
  try {
    let info = await transporter.sendMail({
      from: `"E-IPCR 👻" <${process.env.USER_EMAIL}>`,
      to: recipient,
      subject: "A message from EARIST IPCR",
      html: getEmailStructured(link, heading, title, id),
    });
    console.log("message sent ", info.messageId);
    return info.messageId;
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = sendMail;
