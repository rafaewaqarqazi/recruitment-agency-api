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
    console.log('response', response)
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
exports.allJobs = async (req, res) => {
  const jobs = await Jobs.find();
  await res.json({
    success: true,
    jobs
  });
}

exports.removeUser = async (req, res) => {
  // try {
  //   const result = await User.remove({"_id": req.params.userId});
  //   await res.json(result);
  // } catch (e) {
  //   await res.json({error: e.message})
  // }
};
