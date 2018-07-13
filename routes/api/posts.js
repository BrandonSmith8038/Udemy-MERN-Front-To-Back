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

// @route   POST '/api/post/like/:id'
// @desc    Like A Post
// @access  PRIVATE
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id }).then(profile => {
    Post.findById(req.params.id)
      .then(post => {
        // Check if user has already like the post
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
          return res.status(400).json({ alreadylike: 'User already liked this post' });
        }
        // Add user id to likes arraay
        post.likes.unshift({ user: req.user.id });

        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404))
      .json({ postnotfound: 'No Post Found' });
  });
});

// @route   POST '/api/post/unlike/:id'
// @desc    Unlike A Post
// @access  PRIVATE
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id }).then(profile => {
    Post.findById(req.params.id)
      .then(post => {
        // Check if user has already like the post
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
          return res.status(400).json({ notliked: 'You Have Not Yet Liked This Post' });
        }
        // Get Remove Index
        const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);

        // Splice out of array
        post.likes.splice(removeIndex, 1);

        // Save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404))
      .json({ postnotfound: 'No Post Found' });
  });
});
// @route   POST '/api/post/comment/:id'
// @desc    Add Comment To A Post
// @access  PRIVATE
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  // Check Validation
  if (!isValid) {
    // If any erros, send 400 with errors object
    return res.status(400).json(errors);
  }

  Post.findById(req.params.id)
    .then(post => {
      const { text, name, avatar } = req.body;
      const newComment = {
        text,
        name,
        avatar,
        user: req.user.id,
      };
      // Add to comments array
      post.comments.unshift(newComment);

      // Save
      post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ nopostfound: 'No Post Found' }));
});
// @route   DELETE '/api/post/comment/:id/:comment_id'
// @desc    Remove Comment From A Post
// @access  PRIVATE
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Check if comment exists
        if (
          post.comments.filter(comment => comment._id.toString() === req.params.comment_id)
            .length === 0
        ) {
          return res.status(404).json({ commentnotexist: 'Comment Does Not Exist' });
        }

        // Get Remove Index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice it out of the array
        post.comments.splice(removeIndex, 1);

        // Save The Post
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ nopostfound: 'No Post Found' }));
  }
);
module.exports = router;
