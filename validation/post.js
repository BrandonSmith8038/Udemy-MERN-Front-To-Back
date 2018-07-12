const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
  const errors = {};

  // If The Field Is Not Empty Use What The User Entered, If It Is Empty Convert To Empty String To Use The Validator
  // Is Empty Method
  data.text = !isEmpty(data.text) ? data.text : '';

  if (!Validator.isLength(data.text, { mix: 10, max: 300 })) {
    errors.text = 'Post must be 10 and 300 charecters';
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = 'Text field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
