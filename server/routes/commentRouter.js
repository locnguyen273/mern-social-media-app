const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  unLikeComment,
} = require("../controllers/commentController");

router.post("/comment", auth, createComment);
router.patch("/comment/:id", auth, updateComment);
router.patch("/comment/:id/like", auth, likeComment);
router.patch("/comment/:id/unlike", auth, unLikeComment);
router.delete("/comment/:id", auth, deleteComment);

module.exports = router;
