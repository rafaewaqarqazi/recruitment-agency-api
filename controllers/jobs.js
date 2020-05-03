const Jobs = require('../models/jobs');
require('dotenv').config()
const mongoose = require('mongoose');
exports.newJob = async (req, res) => {
  const body = req.body
  const job = await new Jobs( {
    ...body,
    postedOn: Date.now()
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
    .populate('applications.user', 'firstName lastName email cv')
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
      .populate('applications.user', 'firstName lastName email cv')
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
        applications: {
          user: body.userId,
          status: '1'
        }
      }
    }, {new: true})
      .populate('applications.user', 'firstName lastName email cv')
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
exports.scheduleTest = async (req, res) => {
  const {jobId, applicationsIds, testDate} = req.body
  try {
    const response = await Jobs.findOneAndUpdate({_id: jobId}, {
      $set:{
        "applications.$[elem].status": '2',
        "applications.$[elem].test": {
          date: testDate,
          status: '1'
        },
      }
    }, {
      new: true,
      multi: true,
      arrayFilters: [{"elem._id" : {$in: applicationsIds.map(id => mongoose.Types.ObjectId(id))}}]
    })
      .populate('applications.user', 'firstName lastName email cv')
    if (response) {
      await res.json({
        success: true,
        message: 'Scheduled Successfully!',
        job: response
      });
    } else {
      await res.json({success: false, message: 'could not schedule'})
    }
  } catch (e) {
    console.log(e.message)
    await res.json({success: false, message: 'could not schedule'})
  }
}
exports.scheduleTestInterview = async (req, res) => {
  const {jobId, applicationsIds, status, type, date} = req.body
  try {
    const response = await Jobs.findOneAndUpdate({_id: jobId}, {
      $set:{
        "applications.$[elem].status": status,
        ["applications.$[elem]." + type]: {
          date,
          status: '1'
        },
      }
    }, {
      new: true,
      multi: true,
      arrayFilters: [{"elem._id" : {$in: applicationsIds.map(id => mongoose.Types.ObjectId(id))}}]
    })
      .populate('applications.user', 'firstName lastName email cv')
    if (response) {
      await res.json({
        success: true,
        message: 'Scheduled Successfully!',
        job: response
      });
    } else {
      await res.json({success: false, message: 'could not schedule'})
    }
  } catch (e) {
    console.log(e.message)
    await res.json({success: false, message: 'could not schedule'})
  }
}
exports.changeStatusTestInterview = async (req, res) => {
  const {jobId, applicationId, status, type} = req.body
  try {
    const response = await Jobs.findOneAndUpdate({_id: jobId, "applications._id": applicationId}, {
      $set:{
        ["applications.$."+ type +".status"]: status
      }
    }, {new: true})
      .populate('applications.user', 'firstName lastName email cv')
    if (response) {
      await res.json({
        success: true,
        message: 'Done Successfully!',
        job: response
      });
    } else {
      await res.json({success: false, message: 'could not perform this action'})
    }
  } catch (e) {
    console.log(e.message)
    await res.json({success: false, message: 'could not perform this action'})
  }
}
exports.changeStatusApplication = async (req, res) => {
  const {jobId, applicationsIds, status} = req.body
  try {
    const response = await Jobs.findOneAndUpdate({_id: jobId}, {
      $set:{
        "applications.$[elem].status": status
      }
    }, {
      new: true,
      multi: true,
      arrayFilters: [{"elem._id" : {$in: applicationsIds.map(id => mongoose.Types.ObjectId(id))}}]
    })
      .populate('applications.user', 'firstName lastName email cv')
    if (response) {
      await res.json({
        success: true,
        message: 'Done Successfully!',
        job: response
      });
    } else {
      await res.json({success: false, message: 'could not perform this action'})
    }
  } catch (e) {
    console.log(e.message)
    await res.json({success: false, message: 'could not perform this action'})
  }
}
exports.allJobs = async (req, res) => {
  const jobs = await Jobs.find()
    .populate('applications.user', 'firstName lastName email cv')
  await res.json({
    success: true,
    jobs
  });
}

