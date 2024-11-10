export const generateOTP = () => {
  let otp = "";
  for (let i = 0; i <= 5; i++) {
    const randVal = Math.round(Math.random() * 9);
    otp = otp + randVal;
  }
  return otp;
};

export const generateExpiryTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 3);
  return now;
};
