// const nodemailer = require("nodemailer");
// require('dotenv').config({path: '../.env'});
require("dotenv").config({ path: __dirname + "/../.env" });
const { Resend } = require("resend");

// ✅ Polyfill fetch + Headers for Node <18
if (typeof global.Headers === "undefined") {
  const fetch = require("node-fetch");
  global.fetch = fetch;
  global.Headers = fetch.Headers;
}



console.log("Loaded RESEND_API_KEY:", process.env.RESEND_API_KEY ? "✅ Exists" : "❌ Missing");

const resend = new Resend(process.env.RESEND_API_KEY);

const mailSender = async (email, title, body) => {
  try {
    // let transporter = nodemailer.createTransport({
    //   host: process.env.MAIL_HOST,
    //   auth: {
    //     user: process.env.MAIL_USER,
    //     pass: process.env.MAIL_PASS,
    //   },
    //   secure: false,
    // })

    // let info = await transporter.sendMail({
    //   from: `"TechTrends Learning | Madhusudan Dhakad" <${process.env.MAIL_USER}>`, // sender address
    //   to: `${email}`, // list of receivers
    //   subject: `${title}`, // Subject line
    //   html: `${body}`, // html body
    // })
    // console.log(info.response)
    // return info

    const response = await resend.emails.send({
      from: "TechTrends Learning <noreply@techtrendslearning.info>", // You can replace this with your verified domain later
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });
    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.log(error.message)
    return error.message
  }
}

module.exports = mailSender
