const router = require("express").Router();
const auth = require("../middlewares/auth");
const postCtrl = require("../controllers/postController");

router
  .route("/posts")
  .post(auth, postCtrl.createPost)
  .get(auth, postCtrl.getPosts);

router
  .route("/post/:id")
  .patch(auth, postCtrl.updatePost)
  .get(auth, postCtrl.getPost)
  .delete(auth, postCtrl.deletePost);

router.patch("/post/:id/like", auth, postCtrl.likePost);
router.patch("/post/:id/unlike", auth, postCtrl.unLikePost);
router.patch("/post/:id/report", auth, postCtrl.reportPost);
router.get("/user-posts/:id", auth, postCtrl.getUserPosts);
router.get("/post-discover", auth, postCtrl.getPostDiscover);
router.patch("/savePost/:id", auth, postCtrl.savePost);
router.patch("/unSavePost/:id", auth, postCtrl.unSavePost);
router.get("/getSavePosts", auth, postCtrl.getSavePost);

module.exports = router;
