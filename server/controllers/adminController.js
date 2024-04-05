const Posts = require("../models/postModel");
const Users = require("../models/userModel");
const Comments = require("../models/commentModel");
const asyncHandler = require("express-async-handler");

// lấy danh sách tất cả user
const getTotalUsers = asyncHandler(async (req, res) => {
  try {
    const users = await Users.find();
    const totalUsers = users.length;
    res.status(200).json({
      data: users,
      total: totalUsers,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// lấy danh sách tất cả posts
const getTotalPosts = asyncHandler(async (req, res) => {
  try {
    const posts = await Posts.find();
    const totalPosts = posts.length;
    res.status(200).json({
      data: posts,
      total: totalPosts,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// lấy danh sách tất cả comment
const getTotalComments = asyncHandler(async (req, res) => {
  try {
    const comments = await Comments.find();
    const totalComments = comments.length;
    res.status(200).json({
      data: comments,
      total: totalComments,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// lấy danh sách tất cả likes
const getTotalLikes = asyncHandler(async (req, res) => {
  try {
    const posts = await Posts.find();
    let totalLikes = 0;
    await posts.map((post) => (totalLikes += post.likes.length));
    res.status(200).json({
      data: posts,
      total: totalLikes,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// lấy danh sách tất cả spam posts
const getTotalSpamPosts = asyncHandler(async (req, res) => {
  try {
    const posts = await Posts.find();
    const reportedPosts = await posts.filter((post) => post.reports.length > 2);
    const totalSpamPosts = reportedPosts.length;
    res.status(200).json({
      data: reportedPosts,
      total: totalSpamPosts,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// lấy từng spam posts
const getSpamPosts = asyncHandler(async (req, res) => {
  try {
    const posts = await Posts.find()
      .select("user createdAt reports content")
      .populate({ path: "user", select: "username avatar email" });
    const spamPosts = posts.filter((post) => post.reports.length > 1);

    res.status(200).json({
      data: spamPosts,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// xóa từng spam posts
const deleteSpamPost = asyncHandler(async (req, res) => {
  try {
    const post = await Posts.findByIdAndDelete({
      _id: req.params.id,
    });
    await Comments.deleteMany({ _id: { $in: post.comments } });

    res.status(200).json({
      message: "Post deleted successfully.",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = {
  getTotalUsers,
  getTotalPosts,
  getTotalComments,
  getTotalLikes,
  getTotalSpamPosts,
  getSpamPosts,
  deleteSpamPost,
};
