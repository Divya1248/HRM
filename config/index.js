require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  MONDODB_URL: process.env.MONDODB_URL,
  GMAIL_USER: process.env.GMAIL_USER,
};
