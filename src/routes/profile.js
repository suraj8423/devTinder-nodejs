const express = require("express");
const { userAuth } = require("../middleware/auth");
const { validateEditProfile } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require('../models/user');
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(404).send("Unauthorized user");
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateEditProfile(req);
    const userId = req.user._id;
    const updatedUserDetails = await User.findByIdAndUpdate(userId, req.body, {returnDocument : 'after'});
    res.send(updatedUserDetails);
  } catch (err) {
    console.log(err.message)
    res.status(400).send("something went wrong");
  }
});

profileRouter.patch('/profile/password', userAuth,async (req,res) => {
  try{
    const password = req.body.currentPassword;
    const userDetails = req.user;
   
    const isValidCurrentPassword =  await userDetails.validatePassowrd(password);
    console.log(userDetails)
    if(!isValidCurrentPassword) {
        throw new Error("Password is incorrect");
    }
    const newPassword = req.body.newPassword;
    const newHashPassword = await bcrypt.hash(newPassword, 10);
    console.log(newHashPassword)
    await User.findByIdAndUpdate(userDetails?._id,{password : newHashPassword})
    res.send("Password updated successfully");
  }
  catch (err) {
    console.log(err.message)
    res.status(400).send("Something went wrong");
  }
      
});

module.exports = profileRouter;
