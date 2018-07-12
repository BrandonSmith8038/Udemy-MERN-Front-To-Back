const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Profile Modle
const Profile = require('../../models/Profile');
// Load User Modle
const User = require('../../models/User');

// Load Validation
const validateProfileInput = require('../../validation/profile');

// @route   GET api/profile
// @desc    Get Current Users Profile
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(403).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(400).json(err));
});

// @route   POST api/profile
// @desc    Create A User Profile
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);
  // Check Validation
  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }

  // Get Fields
  const profileFields = {};
  profileFields.user = req.user.id;

  const {
    handle,
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    linkdin,
    twitter,
    instagram,
  } = req.body;

  if (handle) profileFields.handle = handle;
  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubusername) profileFields.githubusername = githubusername;

  // Skills - Split into array
  if (typeof skills !== 'undefined') {
    profileFields.skills = skills.split(',');
  }

  // Social Links
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (facebook) profileFields.social.facebook = facebook;
  if (linkdin) profileFields.social.linkdin = linkdin;
  if (twitter) profileFields.social.twitter = twitter;
  if (instagram) profileFields.social.instagram = instagram;

  Profile.findOne({ user: req.user.id }).then(profile => {
    if (profile) {
      // Update
      Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true }).then(
        profile => res.json(profile)
      );
    } else {
      // Create
      // Check If Handle Exists
      Profile.findOne({ handle: profileFields.handle }).then(profile => {
        if (profile) {
          errors.handle = 'That handle already exists';
          res.status(400).json(errors);
        }
        // Save Profile If Unique
        new Profile(profileFields).save().then(profile => res.json(profile));
      });
    }
  });
});

module.exports = router;
