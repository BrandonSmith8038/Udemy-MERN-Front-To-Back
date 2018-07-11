const mongoose = require('mongoose');
const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
const keys = require('../../config/keys');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User Modal
const User = require('../../models/User');

// @route   GET api/users/register
// @desc    Register A User
// @access  Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'Email Already Exists';
      return res.status(400).json(errors);
    } else {
      const { name, email, password } = req.body;
      const avatar = gravatar.url(email, {
        s: '200', //Size,
        r: 'pg', //Rating,
        d: 'mm', //Default
      });
      const newUser = new User({
        name,
        email,
        avatar,
        password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login User /Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;

  User.findOne({ email }).then(user => {
    // If there is no user found
    if (!user) {
      errors.email = 'User not found';
      return res.status(400).json(errors);
    }
    // Check If Passwords Match
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        }; // Create JWT Payload

        // Sign The Tokem
        jwt.sign(payload, keys.SECRETORKEY, { expiresIn: 3600 }, (err, token) => {
          res.json({ success: true, token: 'Bearer ' + token });
        });
      } else {
        errors.password = 'Password Incorrect';
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET api/users/current
// @desc    Return Current User
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id, name, email } = req.user;
  res.json({ id, name, email });
});

module.exports = router;
