const User = require("../models/User");
const sendOtpToEmail = require("../services/emailService");
const otpGenerate = require("../utils/otpGenerator");
const response = require("../utils/responseHandler");
const twilioService = require("../services/twilloService");
const generateToken = require("../utils/generateToken");
const Conversation = require("../models/Conversation");
const { uploadFileToCloudinary } = require("../config/cloudinaryConfig");

// Step 1 : Send Otp
const sendOtp = async (req, res) => {
  const { phoneNumber, phoneSuffix, email } = req.body;
  const otp = otpGenerate();
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
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

      await sendOtpToEmail(email, otp);
      return response(res, 200, "OTP sent to your email", { email });
    }

    // Phone OTP
    if (!phoneNumber || !phoneSuffix) {
      return response(res, 400, "Invalid phone number or phone suffix");
    }

    const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;

    user = await User.findOne({ phoneNumber: fullPhoneNumber });
    if (!user) {
      user = new User({ phoneNumber: fullPhoneNumber });
    }

    await twilioService.sendOtpToPhoneNumber(fullPhoneNumber);
    await user.save();

    return response(res, 200, "OTP sent successfully", {
      phoneNumber: fullPhoneNumber,
    });
  } catch (error) {
    console.error("sendOtp error:", error);
    return response(res, 500, "Internal server error");
  }
};

// Step 2 Verify Otp

const verifyOtp = async (req, res) => {
  const { phoneNumber, phoneSuffix, email, otp } = req.body;

  if (!otp) return response(res, 400, "OTP is required");

  try {
    let user;

    if (email) {
      user = await User.findOne({ email });
      if (!user) {
        return response(res, 404, "User not found");
      }

      const now = new Date();
      if (
        !user.emailOtp ||
        String(user.emailOtp) !== String(otp) ||
        now > new Date(user.emailOtpExpiry)
      ) {
        return response(res, 400, "Invalid or expired OTP");
      }

      user.isVerified = true;
      user.emailOtp = null;
      user.emailOtpExpiry = null;
      await user.save();
    } else {
      if (!phoneNumber || !phoneSuffix) {
        return response(res, 400, "Invalid phone number or phone suffix");
      }

      const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
      user = await User.findOne({ phoneNumber: fullPhoneNumber });
      if (!user) {
        return response(res, 404, "User not found");
      }

      const result = await twilioService.verifyOtp(fullPhoneNumber, otp);
      if (result.status !== "approved") {
        return response(res, 400, "Invalid OTP");
      }

      user.isVerified = true;
      await user.save();
    }

    const token = generateToken(user?._id);
    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    });

    return response(res, 200, "OTP verified successfully", { token, user });
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal server error");
  }
};

const updateProfile = async (req, res) => {
  const { username, agreed, about } = req.body;
  const userId = req.user.userId;
  try {
    const user = await User.findById(userId);
    const file = req.file;
    if (file) {
      const uploadResult = await uploadFileToCloudinary(file);
      console.log(uploadResult);
      user.profilePicture = uploadResult?.secure_url;
      user.profilePicture;
    } else if (req.body.profilePicture) {
      user.profilePicture = req.body.profilePicture;
    }

    if (username) user.username = username;
    if (agreed) user.agreed = agreed;
    if (about) user.about = about;
    await user.save();

    return response(res, 200, "user profille updated successfully", user);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal server error");
  }
};

const checkAuthenticate = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return response(
        res,
        404,
        "unauthorized! please login before access our app"
      );
    }
    const user = await User.findById(userId);
    if (!user) {
      return response(res, 404, "User not found");
    }
    return response(res, 200, "user retrieved and allow to use the app", user);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal server error");
  }
};

const logout = (req, res) => {
  try {
    res.cookie("auth_token", "", { expires: new Date(0) });
    return response(res, 200, "user logout successfully");
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal server error");
  }
};

const getAllUsers = async (req, res) => {
  const loggedInUser = req.user.userId;
  try {
    const users = await User.find({ _id: { $ne: loggedInUser } })
      .select(
        "username email profilePicture lastSeen isOnline about phoneNumber phoneSuffix"
      )
      .lean();

    const usersWithConversation = await Promise.all(
      users.map(async (user) => {
        const conversation = await Conversation.findOne({
          participants: { $all: [loggedInUser, user?._id] },
        })
          .populate({
            path: "lastMessage",
            select: "content createdAt sender receiver",
          })
          .lean();

        return {
          ...user,
          conversation: conversation || null,
        };
      })
    );
    return response(
      res,
      200,
      "users retrieved successfully",
      usersWithConversation
    );
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal server error");
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  updateProfile,
  logout,
  checkAuthenticate,
  getAllUsers,
};
