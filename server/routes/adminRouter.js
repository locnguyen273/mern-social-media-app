const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getTotalUsers,
  getTotalPosts,
  getTotalComments,
  getTotalLikes,
  getTotalSpamPosts,
  getSpamPosts,
  deleteSpamPost,
} = require("../controllers/adminController");

router.get('/get-total-users' , auth, getTotalUsers);
router.get("/get-total-posts", auth, getTotalPosts);
router.get("/get-total-comments", auth, getTotalComments);
router.get("/get-total-likes", auth, getTotalLikes);
router.get("/get-total-spam-posts", auth, getTotalSpamPosts);
router.get("/get-spam-posts", auth, getSpamPosts);
router.delete("/delete-spam-posts/:id", auth, deleteSpamPost);


module.exports = router;