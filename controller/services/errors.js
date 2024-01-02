import logger from './logger.js';

class ApplicationError extends Error {
  constructor(message) {
    super(message);
    // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name;
    // This clips the constructor invocation from the stack trace.
    // It's not absolutely essential, but it does make the stack trace a little nicer.
    //  @see Node.js reference (bottom)
    Error.captureStackTrace(this, this.constructor);
  }
}

const throwError = (message, code) => {
  let error = new ApplicationError(message);
  if (code) {
    error.code = code;
  }
  throw error;
};

process.on('unhandledRejection', function (error) {
  logger.error({
    message: 'Unhandled Promise Rejection',
    error: {
      code: error.code,
      message: error.message,
      stack: error.stack,
    },
  });
  console.log(error);
});

export { throwError, ApplicationError };
