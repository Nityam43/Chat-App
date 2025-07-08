const twilio = require("twilio");

// Twilio credentials from env
const accountSid = process.env.TWILLO_ACCOUNT_SID;
const authToken = process.env.TWILLO_AUTH_TOKEN;
const serviceSid = process.env.TWILLO_SERVICE_SID;

const client = twilio(accountSid, authToken);

// send otp to phone number
const sendOtpToPhoneNumber = async (phoneNumber) => {
  try {
    console.log("sending otp to this number", phoneNumber);
    if (!phoneNumber) {
      throw new Error("Invalid phone number");
    }
    const response = await client.verify.v2
      .services(serviceSid)
      .verifications.create({
        to: phoneNumber,
        channel: "sms",
      });
    console.log("this is my otp response", response);
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send otp");
  }
};

const verifyOtp = async (phoneNumber, otp) => {
  if (!phoneNumber || !otp) {
    throw new Error("Phone number and OTP are required");
  }

  try {
    console.log("this is my otp", otp);
    console.log("this is my phone number", phoneNumber);

    const result = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({
        to: phoneNumber,
        code: otp,
      });

    console.log("this is my otp response", result);
    return result;
  } catch (error) {
    console.error("OTP verification failed:", error?.message || error);
    throw new Error("OTP verification failed");
  }
};


module.exports = {
  sendOtpToPhoneNumber,
  verifyOtp,
};
