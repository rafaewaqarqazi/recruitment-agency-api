const express = require('express');
const {userById} = require("../controllers/users");
const {
  register,
  verifyEmail,
  login,
  getUser,
  forgotPassword,
  resetPassword,
  resendVerificationCode
} = require('../controllers/auth');
const router = express.Router();
const upload = require('../upload')
router.get('/:userId', getUser);
router.post('/register/:type', upload.single('cv'), register);
router.put('/verify-email', verifyEmail);
router.put('/resend/code', resendVerificationCode);
router.post('/login', login);
router.put('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);

router.param("userId", userById);
module.exports = router;