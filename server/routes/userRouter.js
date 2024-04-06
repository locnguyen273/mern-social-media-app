const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  searchUser,
  getUser,
  updateUser,
  follow,
  unFollow,
  suggestionUser,
} = require("../controllers/userController");

router.get("/search", auth, searchUser);
router.get("/user/:id", auth, getUser);
router.patch("/user", auth, updateUser);
router.patch("/user/:id/follow", auth, follow);
router.patch("/user/:id/un-follow", auth, unFollow);
router.get("/suggestion-user", auth, suggestionUser);

module.exports = router;
