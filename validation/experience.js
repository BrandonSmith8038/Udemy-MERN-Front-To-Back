const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
  const errors = {};

  // If The Field Is Not Empty Use What The User Entered, If It Is Empty Convert To Empty String To Use The Validator
  // Is Empty Method
  let { title, company, from } = data;

  title = !isEmpty(title) ? title : '';
  company = !isEmpty(company) ? company : '';
  from = !isEmpty(from) ? from : '';

  // Title
  if (Validator.isEmpty(title)) {
    errors.title = 'Job title field is required';
  }
  // Company
  if (Validator.isEmpty(company)) {
    errors.company = 'Company field is required';
  }
  // Title
  if (Validator.isEmpty(from)) {
    errors.from = 'From date field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
