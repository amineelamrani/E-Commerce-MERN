const nodemailer = require("nodemailer");

exports.transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.NODE_MAIL,
    pass: process.env.NODE_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
