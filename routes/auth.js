const express = require('express');
const {userById} = require("../controllers/users");
const {
  register,
  login,
  getUser,
  forgotPassword,
  resetPassword
} = require('../controllers/auth');
const router = express.Router();
const upload = require('../upload')
router.get('/:userId', getUser);
router.post('/register/:type', upload.single('cv'), register);
router.post('/login', login);
router.put('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);

router.param("userId", userById);
module.exports = router;