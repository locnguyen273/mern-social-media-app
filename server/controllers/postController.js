const Posts = require("../models/postModel");
const Comments = require("../models/commentModel");
const Users = require("../models/userModel");

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const postCtrl = {
  createPost: async (req, res) => {
    try {
      const { content, images } = req.body;
      if (images.length === 0) {
        return res.status(400).json({ message: "Please add photo(s)" });
      }
      const newPost = new Posts({
        content,
        images,
        user: req.user._id,
      });
      await newPost.save();
      res.status(201).json({
        message: "A new post is created successfully.",
        newPost: {
          ...newPost._doc,
          user: req.user,
        },
        status: true,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  getPosts: async (req, res) => {
    try {
      const features = new APIfeatures(
        Posts.find({
          user: [...req.user.following, req.user._id],
        }),
        req.query
      ).paginating();
      const posts = await features.query
        .sort("-createdAt")
        .populate("user likes", "avatar username fullname followers")
        .populate({
          path: "comments",
          populate: {
            path: "user likes ",
            select: "-password",
          },
        });

      res.status(200).json({
        total: posts.length,
        data: posts,
        status: true,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  updatePost: async (req, res) => {
    try {
      const { content, images } = req.body;
      const post = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          content,
          images,
        }
      )
        .populate("user likes", "avatar username fullname")
        .populate({
          path: "comments",
          populate: {
            path: "user likes ",
            select: "-password",
          },
        });

      res.status(200).json({
        message: "This post is updated successfully.",
        newPost: {
          ...post._doc,
          content,
          images,
        },
        status: true,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  likePost: async (req, res) => {
    try {
      const post = await Posts.find({
        _id: req.params.id,
        likes: req.user._id,
      });
      if (post.length > 0) {
        return res
          .status(400)
          .json({ message: "You have already liked this post" });
      }
      const like = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { likes: req.user._id },
        },
        {
          new: true,
        }
      );
      if (!like) {
        return res.status(400).json({ message: "This post does not exist." });
      }
      res.status(200).json({ 
        message: "This post is liked successfully.",
        status: true
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  unLikePost: async (req, res) => {
    try {
      const like = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { likes: req.user._id },
        },
        {
          new: true,
        }
      );
      if (!like) {
        return res.status(400).json({ message: "This post does not exist." });
      }
      res.status(200).json({ message: "This post is unliked successfully." });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  getUserPosts: async (req, res) => {
    try {
      const features = new APIfeatures(
        Posts.find({ user: req.params.id }),
        req.query
      ).paginating();
      const posts = await features.query.sort("-createdAt");

      res.status(200).json({
        data: posts,
        total: posts.length,
        status: true,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  getPost: async (req, res) => {
    try {
      const post = await Posts.findById(req.params.id)
        .populate("user likes", "avatar username fullname followers")
        .populate({
          path: "comments",
          populate: {
            path: "user likes ",
            select: "-password",
          },
        });

      if (!post) {
        return res.status(400).json({ message: "This post does not exist." });
      }
      res.status(200).json({ 
        data: post,
        status: true,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  getPostDiscover: async (req, res) => {
    try {
      const newArr = [...req.user.following, req.user._id];
      const num = req.query.num || 8;
      const posts = await Posts.aggregate([
        { $match: { user: { $nin: newArr } } },
        { $sample: { size: Number(num) } },
      ]);
      res.status(200).json({
        status: true,
        total: posts.length,
        data: posts,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  deletePost: async (req, res) => {
    try {
      const post = await Posts.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });

      await Comments.deleteMany({ _id: { $in: post.comments } });

      res.status(200).json({
        message: "This post is deleted successfully.",
        newPost: {
          ...post,
          user: req.user,
        },
        status: true,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  reportPost: async (req, res) => {
    try {
      const post = await Posts.find({
        _id: req.params.id,
        reports: req.user._id,
      });
      if (post.length > 0) {
        return res
          .status(400)
          .json({ message: "You have already reported this post" });
      }

      const report = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { reports: req.user._id },
        },
        {
          new: true,
        }
      );

      if (!report) {
        return res.status(400).json({ message: "This post does not exist." });
      }

      res.status(200).json({ 
        message: "This post is reported successfully.",
        status: true,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  savePost: async (req, res) => {
    try {
      const user = await Users.find({
        _id: req.user._id,
        saved: req.params.id,
      });
      if (user.length > 0) {
        return res
          .status(400)
          .json({ message: "You have already saved this post." });
      }

      const save = await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: { saved: req.params.id },
        },
        {
          new: true,
        }
      );
      if (!save) {
        return res.status(400).json({ message: "User does not exist." });
      }
      res.status(200).json({ 
        message: "This post is saved successfully.",
        status: true,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  unSavePost: async (req, res) => {
    try {
      const save = await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $pull: { saved: req.params.id },
        },
        {
          new: true,
        }
      );

      if (!save) {
        return res.status(400).json({ message: "User does not exist." });
      }
      res.status(200).json({ 
        message: "This post is removed from collection successfully.",
        status: true,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  getSavePost: async (req, res) => {
    try {
      const features = new APIfeatures(
        Posts.find({ _id: { $in: req.user.saved } }),
        req.query
      ).paginating();

      const savePosts = await features.query.sort("-createdAt");
      res.status(200).json({
        data: savePosts,
        total: savePosts.length,
        status: true,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = postCtrl;
