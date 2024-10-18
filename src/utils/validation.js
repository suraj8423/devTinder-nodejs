const validator = require('validator');

const validateSignUpDate = (req) => {
  
      const {firstName='',emailId,password=''} = req.body;
      const isValidEmail = validator.isEmail(emailId);
      const isStrongPassword = validator.isStrongPassword(password);
      console.log(isValidEmail,isStrongPassword);
      return isValidEmail && isStrongPassword && firstName?.length;
}

const validateEditProfile = (req) => {
      const allowedEditFields = ["skills","about","photoUrl"];
      const fieldsEditUserRequested = req.body;
      const isEditAllowed = Object.keys(fieldsEditUserRequested).every((field) => {
            return allowedEditFields.includes(field);
      });
      console.log(fieldsEditUserRequested,isEditAllowed)
       if(!isEditAllowed)
            throw new Error("Given fields are not valid");
}

module.exports = {validateSignUpDate,validateEditProfile}