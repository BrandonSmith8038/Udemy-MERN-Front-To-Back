const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEducationInput(data) {
  const errors = {};

  // If The Field Is Not Empty Use What The User Entered, If It Is Empty Convert To Empty String To Use The Validator
  // Is Empty Method
  let { school, degree, fieldofstudy, from } = data;

  school = !isEmpty(school) ? school : '';
  degree = !isEmpty(degree) ? degree : '';
  fieldofstudy = !isEmpty(fieldofstudy) ? fieldofstudy : '';
  from = !isEmpty(from) ? from : '';

  // School
  if (Validator.isEmpty(school)) {
    errors.school = 'School field is required';
  }
  // Degree
  if (Validator.isEmpty(degree)) {
    errors.degree = 'Degree field is required';
  }
  // From
  if (Validator.isEmpty(from)) {
    errors.from = 'From date field is required';
  }
  // Field Of Study
  if (Validator.isEmpty(fieldofstudy)) {
    errors.fieldofstudy = 'Field Of Study date field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
