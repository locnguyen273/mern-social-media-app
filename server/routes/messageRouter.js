const router = require("express").Router();
const auth = require("../middlewares/auth");
const messageCtrl = require("../controllers/messageController");

router.post("/message", auth, messageCtrl.createMessage);
router.get("/conversations", auth, messageCtrl.getConversations);
router.get("/message/:id", auth, messageCtrl.getMessages);

module.exports = router;
