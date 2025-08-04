import mongoose from 'mongoose';
import ErrorBase from '../errors/base.error.js';
import ValidationError from '../errors/validation.error.js';
import IncorretRequest from '../errors/incorretRequest.error.js';

// eslint-disable-next-line no-unused-vars
function errorsManipulator(error, req, res, next) {
  if (error instanceof mongoose.Error.CastError) {
    new IncorretRequest().sendResponse(res);
  } else if (error instanceof mongoose.Error.ValidationError) {
    new ValidationError(error).sendResponse(res);
  } else if (error instanceof ErrorBase) {
    error.sendResponse(res);
  } else {
    new ErrorBase().sendResponse(res);
  }
}

export default errorsManipulator;