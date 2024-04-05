const router = require('express').Router();
const {
  register,
  changePassword,
  registerAdmin,
  login,
  adminLogin,
  logout,
  generateAccessToken,
} = require('../controllers/authController');
const auth = require('../middlewares/auth');

router.post('/register', register);
router.post("/register-admin", registerAdmin);
router.post("/changePassword", auth, changePassword);
router.post("/login", login);
router.post("/admin-login", adminLogin);
router.post("/logout", logout);
router.post("/refresh-token", generateAccessToken);

module.exports = router;