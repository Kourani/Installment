// backend/utils/validation.js
const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)

const handleValidationErrors = (req, _res, next) => {


  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {

    const errors = {};



    validationErrors
      .array()
      .forEach(error => {
        errors[error.path] = error.msg
      });

      console.log(errors, 'errrors')
      console.log(validationErrors, 'HERE')



    const err = Error("Validation Error");
    // err.errors = errors;
    err.title = "Bad request.";
    err.status = 400;
    err.errors = Object.values(errors)
    // err.errors = { message:errors.undefined, status:400};

    // Error.captureStackTrace(err, handleValidationErrors)
    // err.stack=null
    // delete err.stack
    next(err);

  }
  next();

};

module.exports = {
  handleValidationErrors
};
