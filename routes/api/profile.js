const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Profile Modle
const Profile = require('../../models/Profile');
// Load User Modle
const User = require('../../models/User');

// @route   GET api/profile
// @desc    Get Current Users Profile
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(403).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(400).json(err));
});

module.exports = router;
