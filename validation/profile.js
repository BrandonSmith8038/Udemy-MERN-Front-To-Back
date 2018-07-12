const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
  const errors = {};

  // If The Field Is Not Empty Use What The User Entered, If It Is Empty Convert To Empty String To Use The Validator
  // Is Empty Method
  const { website, youtube, linkdin, facebook, twitter, instagram } = data;
  let { handle, status, skills } = data;

  handle = !isEmpty(handle) ? handle : '';
  status = !isEmpty(status) ? status : '';
  skills = !isEmpty(skills) ? skills : '';

  // Handle
  if (!Validator.isLength(handle, { min: 2, max: 40 })) {
    errors.handle = 'Handle needs to between 2 and 4 characters';
  }

  if (Validator.isEmpty(handle)) {
    errors.handle = 'Profile handle is required';
  }

  //  Status
  if (Validator.isEmpty(status)) {
    errors.status = 'Status field is required';
  }

  // Skills
  if (Validator.isEmpty(skills)) {
    errors.skills = 'Skills field is required';
  }

  // Website
  if (!isEmpty(website)) {
    if (!Validator.isURL(website)) {
      errors.website = 'Not a valid URL';
    }
  }
  if (!isEmpty(youtube)) {
    if (!Validator.isURL(youtube)) {
      errors.youtube = 'Not a valid URL';
    }
  }
  if (!isEmpty(linkdin)) {
    if (!Validator.isURL(linkdin)) {
      errors.linkdin = 'Not a valid URL';
    }
  }
  if (!isEmpty(facebook)) {
    if (!Validator.isURL(facebook)) {
      errors.facebook = 'Not a valid URL';
    }
  }
  if (!isEmpty(twitter)) {
    if (!Validator.isURL(twitter)) {
      errors.twitter = 'Not a valid URL';
    }
  }
  if (!isEmpty(instagram)) {
    if (!Validator.isURL(instagram)) {
      errors.instagram = 'Not a valid URL';
    }
  }

  // Social

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
