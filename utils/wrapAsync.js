// This utility function wraps an async function and catches any errors, passing them to the next middleware.
function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => next(err));
  };
}

module.exports = { wrapAsync };
