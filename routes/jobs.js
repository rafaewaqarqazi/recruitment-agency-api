const express = require('express');
const router = express.Router();
const {
  newJob,
  editJob,
  allJobs,
  deleteJob,
  applyForJob
} = require('../controllers/jobs');
const {requireSignin, isAdmin, isUser} = require('../controllers/auth');

router.post('/new', requireSignin, isAdmin, newJob);
router.put('/edit', requireSignin, isAdmin, editJob);
router.put('/delete', requireSignin, isAdmin, deleteJob);
router.put('/apply', requireSignin, isUser, applyForJob);
router.get('/all', allJobs);
module.exports = router;