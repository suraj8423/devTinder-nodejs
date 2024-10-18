const { mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: [5, 'FirstName must be at least 5 characters long'],
    maxlength: [15, 'FirstName must be at most 15 characters long']
  },
  lastName: {
    type: String,
    minlength: [5, 'LastName must be at least 5 characters long'],
    maxlength: [15, 'LastName must be at most 15 characters long']
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    enum: {
      values: ["Male", "Female", "Trans"],
      message: "{VALUE} is not supported",
    },
  },
  photoUrl: {
    type: String,
  },
  about: {
    type: String,
    default: "This is default value for about",
  },
  skills: {
    type: [String],
  },
},{timestamps : true});

userSchema.methods.getJWT = async function () {
  const user = this;
  const privateKey = "iamno1231jdskdufd";
  const token = await jwt.sign({ _id: user._id }, privateKey);
  return token;
}

userSchema.methods.validatePassowrd = async function(password) {
  const user = this;
  
  console.log(password)
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
 
  return isPasswordCorrect;
}



const User = mongoose.model("User", userSchema);
module.exports =  User ;
