const jwt = require('jsonwebtoken');
const expressjwt = require('express-jwt');
require('dotenv').config();
const User = require('../models/users');
const {sendEmail} = require("../helpers");

exports.register = async (req, res) => {

  const body = JSON.parse(req.body.data)
  const userExists = await User.findOne({email: body.email});
  if (userExists) return res.json({
    success: false,
    message: "User Already Exists"
  });
  const newUserData = {
    ...body,
    role: '1',
    user_details: {
      cv: {
        filename: req.file.filename
      }
    }
  }
  const user = await new User(newUserData);
  const newUser = await user.save();
  if (newUser) {
    await res.json({
      success: true
    });
  }
};

exports.login = (req, res) => {
  const {email, password} = req.body;
  User.findOne({email}, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        message: "User does not exist"
      })
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        message: "Email/Password does not match"
      })
    }
    //Generating Key
    const {_id, firstName, lastName, email, role, lawyer_details, clientDetails} = user;

    const authToken = jwt.sign({_id, role}, process.env.JWT_SECRET);
    const loggedInUser = {
      _id,
      email,
      firstName,
      lastName,
      role,
      lawyer_details,
      clientDetails
    };
    return res.json({
      authToken,
      user: loggedInUser
    });
  })
};

exports.isAdmin = (req, res, next) => {
  let admin = req.auth && req.auth.role === "2";
  if (!admin) {
    return res.status(403).json({
      error: "You are Not Authorized to perform this action"
    })
  }
  next();
};


exports.requireSignin = expressjwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'auth'
});


// add forgotPassword and resetPassword methods
exports.forgotPassword = (req, res) => {
  if (!req.body) return res.status(400).json({message: "No request body"});
  if (!req.body.email)
    return res.status(400).json({message: "No Email in request body"});

  const {email} = req.body;

  // find the user based on email
  User.findOne({email}, (err, user) => {
    // if err or no user
    if (err || !user)
      return res.status("401").json({
        error: "User with this email does not exist!"
      });

    // generate a token with user id and secret
    const token = jwt.sign(
      {_id: user._id, iss: "NODEAPI"},
      process.env.JWT_SECRET
    );

    // email data
    const emailData = {
      from: "noreply@node-react.com",
      to: email,
      subject: "Password Reset Instructions",
      text: `Please use the following link to reset your password: ${
        process.env.CLIENT_URL
      }/reset-password/${token}`,
      html: `<p>Please use the following link to reset your password:</p> <p>${
        process.env.CLIENT_URL
      }/reset-password/${token}</p>`
    };

    return user.updateOne({resetPasswordLink: token}, (err, success) => {
      if (err) {
        return res.json({message: err});
      } else {
        sendEmail(emailData);
        return res.status(200).json({
          message: `Email has been sent with reset password link.`
        });
      }
    });
  });
};


exports.resetPassword = (req, res) => {
  const {resetPasswordLink, newPassword} = req.body;

  User.findOne({resetPasswordLink}, (err, user) => {
    // if err or no user
    if (err || !user)
      return res.status("401").json({
        error: "Invalid Link!"
      });

    const updatedFields = {
      password: newPassword,
      resetPasswordLink: ""
    };

    Object.assign(user, updatedFields);
    user.updated = Date.now();

    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      res.json({
        message: `Great! You can login with new Password Now.`
      });
    });
  });
};
exports.getUser = (req, res) => {
  res.json(req.profile)
};
