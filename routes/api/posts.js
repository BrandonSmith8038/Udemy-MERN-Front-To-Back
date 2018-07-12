const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/posts');
const Profile = require('../../models/Profile');

// Load Validation
const validatePostInput = require('../../validation/post');

// @route   GET api/post
// @desc    Get Posts
// @access  PUBLIC
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostfound: 'No Posts Found' }));
});

// @route   GET api/post/:id
// @desc    Get Post by id
// @access  PUBLIC
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ nopostfound: 'No Post Found With That Id' }));
});

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

// @route   DELETE /api/posts/:id
// @desc    Delete Post
// @access  PRIVATE
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id }).then(profile => {
    Post.findById(req.params.id)
      .then(post => {
        // Check For Post Owner
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: 'User not authorized' });
        }
        // Delete
        post.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(404))
      .json({ postnotfound: 'No Post Found' });
  });
});
module.exports = router;
