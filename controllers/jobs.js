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
