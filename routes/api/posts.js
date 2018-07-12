const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/posts');

// Load Validation
const validatePostInput = require('../../validation/post');

// @route   POST api/posts
// @desc    Create Post
// @access  PRIVATE
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  // Check Validation
  if (!isValid) {
    // If any erros, send 400 with errors object
    return res.status(400).json(errors);
  }

  const { text, name, avatar } = req.body;
  const newPost = new Post({
    text,
    name,
    avatar,
    user: req.user.id,
  });

  newPost.save().then(post => res.json(post));
});
module.exports = router;
