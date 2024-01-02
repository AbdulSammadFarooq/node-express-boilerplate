import { recursivelySanitize } from '../services/sanitize.js';
import { copyObject } from '../services/objects.js';

const middleware = (req, res, next) => {
  if (req.body) {
    req.unsanitizedBody = copyObject(req.body);
    recursivelySanitize(req.body);
  }
  if (req.params) {
    recursivelySanitize(req.params);
  }
  if (req.query) {
    recursivelySanitize(req.query);
  }
  next();
};

export default middleware;
