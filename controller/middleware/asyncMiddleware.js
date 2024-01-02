const asyncHandler = fn => {
  if (fn instanceof Function) {
    return function (req, res, next) {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
};

const thenNext = fn => {
  if (fn instanceof Function) {
    return async function (req, res, next) {
      try {
        await Promise.resolve(fn(req, res, next));
        next();
      } catch (err) {
        next(err);
      }
    };
  } else {
    return function (req, res, next) {
      next();
    };
  }
};

export { asyncHandler, thenNext };
