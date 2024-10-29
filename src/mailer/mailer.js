import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "shoyoyemarvellous@gmail.com",
    pass: process.env.APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: true,
  },
});

async function SendEmail(to, subject, text, html) {
  try {
    const info = await transporter.sendMail({
      from: '"FUND CARE" <shoyoyemarvellous@gmail.com>',
      to: to,
      subject: subject,
      text: text,
      html: html,
    });
    console.log("Email sent: " + info.response);
    return { message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export default SendEmail;
