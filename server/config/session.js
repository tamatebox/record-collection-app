require('dotenv').config();
const session = require('express-session');

const createSessionConfig = () => {
  return session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24時間
    }
  });
};

module.exports = {
  createSessionConfig
};
