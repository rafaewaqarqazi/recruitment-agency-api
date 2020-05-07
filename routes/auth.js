const express = require('express');
const {userById} = require("../controllers/users");
const {
  register,
  editProfile,
  login,
  getUser,
  forgotPassword,
  resetPassword,
  registerAdmin,
  editProfileImage,
  changePassword,
  getAllAdmins,
  requireSignin,
  isAdmin,
  removeAdmin
} = require('../controllers/auth');
const router = express.Router();
const upload = require('../upload')
router.get('/:userId', getUser);
router.post('/register/:type', upload.single('cv'), register);
router.put('/profile/edit/:type', upload.single('cv'), editProfile);
router.put('/profile/image/:type', upload.single('image'), editProfileImage);
router.post('/admin/register', registerAdmin);
router.post('/login', login);
router.put('/forgot-password', forgotPassword);
router.put('/change-password', changePassword);
router.put('/reset-password', resetPassword);
router.get('/admins/all', requireSignin, isAdmin, getAllAdmins);
router.put('/admins/remove', requireSignin, isAdmin, removeAdmin);

router.param("userId", userById);
module.exports = router;