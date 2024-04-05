const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  searchUser,
  getUser,
  updateUser,
  follow,
  unfollow,
  suggestionUser,
} = require("../controllers/userController");

router.get("/search", auth, searchUser);
router.get("/user/:id", auth, getUser);
router.patch("/user", auth, updateUser);
router.patch("/user/:id/follow", auth, follow);
router.patch("/user/:id/unfollow", auth, unfollow);
router.get("/suggestion-user", auth, suggestionUser);

module.exports = router;
