const Comments = require("../models/commentModel");
const Posts = require("../models/postModel");
const asyncHandler = require("express-async-handler");

const createComment = asyncHandler(async (req, res) => {
  try {
    const { postId, content, tag, reply, postUserId } = req.body;
    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post does not exist." });
    }
    if (reply) {
      const comment = await Comments.findById(reply);
      if (!comment) {
        return res.status(400).json({ message: "Comment does not exist." });
      }
    }
    const newComment = new Comments({
      user: req.user._id,
      content,
      tag,
      reply,
      postUserId,
      postId,
    });
    await Posts.findOneAndUpdate(
      { _id: postId },
      {
        $push: { comments: newComment._id },
      },
      { new: true }
    );

    await newComment.save();
    res.status(201).json({
      message: "A new comment is created successfully.",
      data: newComment,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const updateComment = asyncHandler(async (req, res) => {
  try {
    const { content } = req.body;
    await Comments.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { content }
    );
    res.status(200).json({
      message: "This comment is updated successfully.",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  try {
    const comment = await Comments.findOneAndDelete({
      _id: req.params.id,
      $or: [{ user: req.user._id }, { postUserId: req.user._id }],
    });
    await Posts.findOneAndUpdate(
      { _id: comment.postId },
      {
        $pull: { comments: req.params.id },
      }
    );
    res.status(200).json({
      message: "This comment is deleted successfully.",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const likeComment = asyncHandler(async (req, res) => {
  try {
    const comment = await Comments.find({
      _id: req.params.id,
      likes: req.user._id,
    });
    if (comment.length > 0) {
      return res
        .status(400)
        .json({ message: "You have already liked this post" });
    }
    await Comments.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: { likes: req.user._id },
      },
      {
        new: true,
      }
    );
    res.status(200).json({ message: "This comment is liked successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const unLikeComment = asyncHandler(async (req, res) => {
  try {
    await Comments.findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: { likes: req.user._id },
      },
      {
        new: true,
      }
    );
    res.status(200).json({ msg: "This comment is unliked successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  unLikeComment,
};
