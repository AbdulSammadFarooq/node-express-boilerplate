const settings = require('../../settings');
const errors = require('../services/errors');
module.exports = async function (req, res, next) {
  let token = req.headers['app-auth-token'];
  if (token != settings.appKey) {
    errors.throwError('App authentication failed', 401);
  }
};
