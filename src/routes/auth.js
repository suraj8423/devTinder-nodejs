const express = require('express');
const authRouter = express.Router();
const { validateSignUpDate } = require("../utils/validation");
const User = require('../models/user')
const bcrypt = require("bcrypt");


authRouter.post("/signup", async (req, res) => {
    try {
      const isValidReq = validateSignUpDate(req);
      if (!isValidReq) {
        throw new Error("Invalid Request");
      }
  
      const { firstName, lastName, emailId, password } = req.body;
      const hashPassword = await bcrypt.hash(password, 10);
  
      const user = new User({
        firstName,
        lastName,
        emailId,
        password: hashPassword,
      });
  
      await user.save();
      res.send("User successfully signed up");
    } catch (err) {
      console.log(err.message);
      res.status(400).send(err.message);
    }
  });


  authRouter.post("/login", async (req, res) => {
    const { emailId, password } = req.body;
    const userDetails = await User.findOne({ emailId });
    const isPasswordCorrect = await userDetails.validatePassowrd(password);
    if (isPasswordCorrect) {
      const token = await userDetails.getJWT();
      res.cookie("token", token);
      res.send("user Successfully logedIn");
    } else {
      res.send("Email or password is invalid");
    }
  });

  authRouter.post('/logout',async(req,res) => {
    res.clearCookie('token ')
       res.send("User Logged out");
  })

  module.exports = authRouter;
