import validator from "validator";

// Validate Email
export const validateEmail = (email) => {
  return validator.isEmail(email);
};

// Validate Password
export const validatePassword = (password) => {
  return validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });
};
