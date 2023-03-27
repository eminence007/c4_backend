const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../Models/user.model");
const UserRouter = express.Router();

UserRouter.post("/register", async (req, res) => {
  const { password, ...payload } = req.body;
  try {
    const Check = await UserModel.findOne({ email: payload.email });
    if (!Check) {
      const hash = await bcrypt.hash(password, 5);
      const user = new UserModel({ ...payload, password: hash });
      await user.save();
      res.status(200).json({ msg: "Registered Successfully" });
    } else {
      res.status(403).json({ msg: "User already exist, please login" });
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(403).json({ msg: error });
  }
});

UserRouter.post("/login", async (req, res) => {
  const { password, email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    console.log("user:", user);

    if (!user) return res.status(404).json({ msg: "User does not exist" });

    const isMatched = await bcrypt.compare(password, user.password);
    if (isMatched) {
      const token = jwt.sign(
        { userID: user._id },
        process.env.DECODING_SECRET_KEY
      );
      res.status(200).json({ msg: "Login Successful!", user, token });
    } else {
      res.status(401).json({ msg: "Wrong Password!" });
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(403).json({ msg: error });
  }
});

module.exports = { UserRouter };
