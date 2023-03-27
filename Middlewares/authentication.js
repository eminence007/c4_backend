const jwt = require("jsonwebtoken");
require("dotenv").config();

const Authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    jwt.verify(token, process.env.DECODING_SECRET_KEY, async (err, decode) => {
      console.log("decode:", decode);
      if (decode) {
        req.body.userID = decode.userID;
        next();
      } else {
        res.send({ msg: "Password is Valid" });
      }
    });
  } catch (error) {
    console.log("error:", error);
    res.send({ msg: "Token is Valid" });
  }
};

module.exports = { Authentication };
