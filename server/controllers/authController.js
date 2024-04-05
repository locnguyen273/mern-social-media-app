const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const register = asyncHandler(async (req, res) => {
  try {
    const { fullname, username, email, password, gender } = req.body;
    let newUserName = username.toLowerCase().replace(/ /g, "");
    const usernameExisted = await Users.findOne({ username: newUserName });
    if (usernameExisted) {
      return res
        .status(400)
        .json({ message: "This username is already taken." });
    }
    const userEmailExisted = await Users.findOne({ email });
    if (userEmailExisted) {
      return res
        .status(400)
        .json({ message: "This email is already registered." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = new Users({
      fullname,
      username: newUserName,
      email,
      password: passwordHash,
      gender,
    });
    const accessToken = createAccessToken({ id: newUser._id });
    const refreshToken = createRefreshToken({ id: newUser._id });
    res.cookie("refreshtoken", refreshToken, {
      httpOnly: true,
      path: "/api/refreshToken",
      maxAge: 30 * 24 * 60 * 60 * 1000, //validity of 30 days
    });
    await newUser.save();
    res.status(201).json({
      message: "User is registered successfully.",
      token: accessToken,
      user: {
        ...newUser._doc,
        password: "",
      },
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const changePassword = asyncHandler(async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await Users.findOne({ _id: req.user._id });
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Your password is wrong." });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }
    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    await Users.findOneAndUpdate(
      { _id: req.user._id },
      { password: newPasswordHash }
    );
    res.json({
      message: "Password is updated successfully.",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const registerAdmin = asyncHandler(async (req, res) => {
  try {
    const { fullname, username, email, password, gender, role } = req.body;
    let newUserName = username.toLowerCase().replace(/ /g, "");
    const usernameExisted = await Users.findOne({ username: newUserName });
    if (usernameExisted) {
      return res
        .status(400)
        .json({ message: "This username is already taken." });
    }
    const userEmailExisted = await Users.findOne({ email });
    if (userEmailExisted) {
      return res
        .status(400)
        .json({ message: "This email is already registered." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = new Users({
      fullname,
      username: newUserName,
      email,
      password: passwordHash,
      gender,
      role,
    });
    await newUser.save();
    res.status(201).json({ message: "Admin is registered successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email, role: "user" }).populate(
      "followers following",
      "-password"
    );
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email or Password is incorrect." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email or Password is incorrect." });
    }
    const accessToken = createAccessToken({ id: user._id });
    const refreshToken = createRefreshToken({ id: user._id });
    res.cookie("refreshtoken", refreshToken, {
      httpOnly: true,
      path: "/api/refreshToken",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, //validity of 30 days
    });

    res.status(200).json({
      message: "Logged in  Successfully!",
      status: true,
      token: accessToken,
      user: {
        ...user._doc,
        password: "",
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const adminLogin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email, role: "admin" });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email or Password is incorrect." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email or Password is incorrect." });
    }
    const accessToken = createAccessToken({ id: user._id });
    const refreshToken = createRefreshToken({ id: user._id });

    res.cookie("refreshtoken", refreshToken, {
      httpOnly: true,
      path: "/api/refreshToken",
      maxAge: 30 * 24 * 60 * 60 * 1000, //validity of 30 days
    });
    res.status(200).json({
      message: "Logged in  Successfully!",
      status: true,
      token: accessToken,
      user: {
        ...user._doc,
        password: "",
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const logout = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("refreshtoken", { path: "/api/refreshToken" });
    return res.json({ message: "Logged out Successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const generateAccessToken = asyncHandler(async (req, res) => {
  try {
    const rfToken = req.cookies.refreshtoken;
    if (!rfToken) {
      return res.status(400).json({ message: "Please login again." });
    }
    jwt.verify(
      rfToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, result) => {
        if (err) {
          res.status(400).json({ message: "Please login again." });
        }
        const user = await Users.findById(result.id)
          .select("-password")
          .populate("followers following", "-password");
        if (!user) {
          res.status(400).json({ message: "User does not exist." });
        }

        const accessToken = createAccessToken({ id: result.id });
        res.json({ accessToken, user });
      }
    );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  register,
  changePassword,
  registerAdmin,
  login,
  adminLogin,
  logout,
  generateAccessToken,
};
