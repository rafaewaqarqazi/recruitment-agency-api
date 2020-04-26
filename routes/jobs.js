const express = require('express');
const {isAdmin} = require("../controllers/auth");
const router = express.Router();
const {
  newJob,
  allJobs
} = require('../controllers/jobs');
const {requireSignin} = require('../controllers/auth');

router.post('/new', requireSignin, isAdmin, newJob);
router.get('/all', allJobs);
module.exports = router;