const Users = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const searchUser = asyncHandler(async (req, res) => {
  try {
    const users = await Users.find({
      username: { $regex: req.query.username },
    })
      .limit(10)
      .select("fullname username avatar");

    res.status(200).json({
      data: users,
      total: users.length,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const getUser = asyncHandler(async (req, res) => {
  try {
    const user = await Users.findById(req.params.id)
      .select("-password")
      .populate("followers following", "-password");
    if (!user) {
      return res
        .status(400)
        .json({ message: "requested user does not exist." });
    }
    res.status(200).json({
      data: user,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  try {
    const { avatar, fullname, mobile, address, story, website, gender } =
      req.body;
    if (!fullname) {
      return res.status(400).json({ message: "Please add your full name." });
    }
    const userUpdated = await Users.findOneAndUpdate(
      { _id: req.user._id },
      { avatar, fullname, mobile, address, story, website, gender }
    );
    res.status(200).json({
      message: "Profile updated successfully.",
      data: userUpdated,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const follow = asyncHandler(async (req, res) => {
  try {
    const user = await Users.find({
      _id: req.params.id,
      followers: req.user._id,
    });
    if (user.length > 0)
      return res
        .status(500)
        .json({ message: "You are already following this user." });
    const newUser = await Users.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          followers: req.user._id,
        },
      },
      { new: true }
    ).populate("followers following", "-password");

    await Users.findOneAndUpdate(
      { _id: req.user._id },
      { $push: { following: req.params.id } },
      { new: true }
    );

    res.status(200).json({
      data: newUser,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const unfollow = asyncHandler(async (req, res) => {
  try {
    const newUser = await Users.findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: { followers: req.user._id },
      },
      { new: true }
    ).populate("followers following", "-password");
    await Users.findOneAndUpdate(
      { _id: req.user._id },
      { $pull: { following: req.params.id } },
      { new: true }
    );
    res.status(200).json({
      data: newUser,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const suggestionUser = asyncHandler(async (req, res) => {
  try {
    const newArr = [...req.user.following, req.user._id];
    const num = req.query.num || 10;
    const users = await Users.aggregate([
      { $match: { _id: { $nin: newArr } } },
      { $sample: { size: Number(num) } },
      {
        $lookup: {
          from: "users",
          localField: "followers",
          foreignField: "_id",
          as: "followers",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "following",
          foreignField: "_id",
          as: "following",
        },
      },
    ]).project("-password");

    return res.status(200).json({
      data: users,
      total: users.length,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = {
  searchUser,
  getUser,
  updateUser,
  follow,
  unfollow,
  suggestionUser,
};
