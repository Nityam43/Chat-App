const User = require("../models/User");
const otpGenerate = require("../utils/otpGenerator");
const response = require("../utils/responseHandler");

// Step 1 : Send Otp
const sendOtp = async (req, res) => {
  const { phoneNumber, phoneSuffix, email } = req.body;
  const otp = otpGenerate();
  const expiry = new Date(Date.now() + 5 * 60 * 1000);
  let user;
  try {
    if (email) {
      user = await User.findOne({ email });

      if (!user) {
        user = new User({ email });
      }
      user.emailOtp = otp;
      user.emailOtpExpiry = expiry;
      await user.save();

      return response(res, 200, "Otp sent successfully", { email });
    }
    if (!phoneNumber || !phoneSuffix) {
      return response(res, 400, "Invalid phone number or phone suffix");
    }
    const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
    user = await User.findOne({ phoneNumber });
    if (!user) {
      user = await new User({ phoneNumber, phoneSuffix });
    }

    await user.save();

    return response(res, 200, "Otp sent successfully", user);
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error");
  }
};
