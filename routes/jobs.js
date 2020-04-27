const express = require('express');
const {isAdmin} = require("../controllers/auth");
const router = express.Router();
const {
  newJob,
  editJob,
  allJobs,
  deleteJob
} = require('../controllers/jobs');
const {requireSignin} = require('../controllers/auth');

router.post('/new', requireSignin, isAdmin, newJob);
router.put('/edit', requireSignin, isAdmin, editJob);
router.put('/delete', requireSignin, isAdmin, deleteJob);
router.get('/all', allJobs);
module.exports = router;