const nodemailer = require("nodemailer");

const sendEmail = async function(options) {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  let obj = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: options.to,
    subject: options.subject,
    text: options.message,
  };
  let info = await transporter.sendMail(obj);

  console.log("Message sent: %s", info.messageId);
}

module.exports = sendEmail;