const jwt = require("jsonwebtoken");
const  User  = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    const privateKey = "iamno1231jdskdufd";
    const temp = await jwt.verify(token, privateKey);
    const user = await User.findById(temp?._id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR : " + err.message)
  }
};

module.exports = {
  userAuth,
};
