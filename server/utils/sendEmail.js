const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter using Hostinger SMTP settings
  // User needs to fill in HOSTINGER_EMAIL_USER and HOSTINGER_EMAIL_PASS in .env
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: process.env.SMTP_PORT || 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html, // Optional HTML content
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
