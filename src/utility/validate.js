import validator from "validator";
import { errorResponse } from "../utility/error.js";

export const validateEmail = (Email) => {
  const validEmail = validator.isEmail(Email);
  if (!validEmail) {
    throw errorResponse(400, "Invalid Email passed");
  }
};

export const validatePassword = (Password) => {
  const validPassword = validator.isStrongPassword(Password);
  if (!validPassword) {
    throw errorResponse(
      400,
      "Please enter a strong password, at least 8 digit character containing an uppercase, a number and a special character"
    );
  }
};

export const validatePhoneNumber = (PhoneNumber) => {
  const validPhoneNumber = validator.isMobilePhone(PhoneNumber, "any", {
    strictMode: true,
  });
  if (!validPhoneNumber) {
    throw errorResponse(400, "Invalid Phone Number passed");
  }
};

export const checkPasswordsMatch = (newPassword, confirmNewPassword) => {
  return newPassword === confirmNewPassword;
};
