import logger from '../services/logger.js';
import * as objects from '../services/objects.js';

export default function (req, res, next) {
  if (req.url !== '/') {
    // Do not log the healthcheck, AWS sends request very frequently
    let body = objects.copyObject(req.body);
    if (body.password) delete body.password;

    let log = {
      url: req.url,
      method: req.method,
      body: body,
      params: req.params,
      query: req.query,
    };
    if (req.auth && req.auth.user.id) log.user_id = req.auth.user.id;
    logger.debug('Request to express API', log);
  }

  next();
}
