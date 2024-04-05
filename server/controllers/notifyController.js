const Notifies = require('../models/notifyModel');
const asyncHandler = require("express-async-handler");

const createNotify = asyncHandler(async (req, res) => {
  try {
    const { id, recipients, url, text, content, image } = req.body;
    if (recipients.includes(req.user._id.toString())) return;
    const notify = new Notifies({
      id,
      recipients,
      url,
      text,
      content,
      image,
      user: req.user._id,
    });

    await notify.save();
    return res.status(201).json({ 
      status: true,
      message: "A notify is created successfully.",
      data: notify 
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const removeNotify = asyncHandler(async (req, res) => {
  try {
    await Notifies.findOneAndDelete({
      id: req.params.id,
      url: req.query.url,
    });
    return res.status(201).json({ 
      status: true,
      message: "This notify is deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const getNotifies = asyncHandler(async (req, res) => {
  try {
    const notifies = await Notifies.find({ recipients: req.user._id })
    .sort("-createdAt")
    .populate("user", "avatar username");

  return res.status(200).json({ 
    data: notifies, 
    status: true,
  });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const isReadNotify = asyncHandler(async (req, res) => {
  try {
    const notifies = await Notifies.findOneAndUpdate(
      { _id: req.params.id },
      {
        isRead: true,
      }
    );
    return res.status(200).json({ 
      data: notifies,
      status: true,
      message: "This notify is read."
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const deleteAllNotifies = asyncHandler(async (req, res) => {
  try {
    const notifies = await Notifies.deleteMany({ recipients: req.user._id });

    return res.status(200).json({ 
      data: notifies, 
      message: "All notifies is deleted successfully.",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = {
  createNotify,
  removeNotify,
  getNotifies,
  isReadNotify,
  deleteAllNotifies,
}
