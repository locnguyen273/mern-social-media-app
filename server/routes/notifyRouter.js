const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  createNotify,
  removeNotify,
  getNotifies,
  isReadNotify,
  deleteAllNotifies,
} = require("../controllers/notifyController");

router.post("/notify", auth, createNotify);
router.delete("/notify/:id", auth, removeNotify);
router.get("/notifies", auth, getNotifies);
router.patch("/isReadNotify/:id", auth, isReadNotify);
router.delete("/deleteAllNotify", auth, deleteAllNotifies);

module.exports = router;
