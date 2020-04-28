const Jobs = require('../models/jobs');
require('dotenv').config()

exports.newJob = async (req, res) => {
  const body = req.body
  const job = await new Jobs( {
    ...body
  });
  const newJob = await job.save();
  if (newJob) {
    await res.json({
      success: true,
      job: newJob
    });
  }
}
exports.editJob = async (req, res) => {
  const body = req.body
  const editData = {...body}
  delete editData._id
  const job = await Jobs.findByIdAndUpdate(body._id, {
    ...editData
  }, {new: true})
  if (job) {
    await res.json({
      success: true,
      job
    });
  }
}
exports.deleteJob = async (req, res) => {
  const body = req.body
  try {
    const response = await Jobs.findByIdAndDelete(body.id)
    if (response) {
      await res.json({
        success: true,
        message: 'Job Post Deleted Successfully!'
      });
    } else {
      await res.json({success: false, message: 'could not delete job post'})
    }
  } catch (e) {
    await res.json({success: false, message: 'could not delete job post'})
  }
}
exports.applyForJob = async (req, res) => {
  const body = req.body
  try {
    const response = await Jobs.findByIdAndUpdate(body.jobId, {
      $addToSet: {
        applications: body.userId
      }
    }, {new: true})
    if (response) {
      await res.json({
        success: true,
        message: 'Applied Successfully!',
        job: response
      });
    } else {
      await res.json({success: false, message: 'could not apply'})
    }
  } catch (e) {
    await res.json({success: false, message: 'could not apply'})
  }
}
exports.allJobs = async (req, res) => {
  const jobs = await Jobs.find();
  await res.json({
    success: true,
    jobs
  });
}

