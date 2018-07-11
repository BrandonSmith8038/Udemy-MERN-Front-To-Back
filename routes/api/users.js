const mongoose = require('mongoose');
const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const keys = require('../../config/keys');

// Load User Modal
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Test users route
// @access  Public
router.get('/test', (req, res) => {
  res.json({ msg: 'Users Works' });
});

// @route   GET api/users/register
// @desc    Register A User
// @access  Public
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: 'Email Already Exists' });
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
  const { email, password } = req.body;

  User.findOne({ email }).then(user => {
    // If there is no user found
    if (!user) {
      return res.status(400).json({ email: 'User not found' });
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
        return res.status(400).json({ password: 'Password Incorrect' });
      }
    });
  });
});

module.exports = router;
