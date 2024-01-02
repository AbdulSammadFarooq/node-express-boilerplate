import jwt from 'jsonwebtoken';
import settings from '../../settings.js';
import { throwError } from './errors.js';

const createJwtToken = (user, options) => {
  let payload = {
    id: user._id.toString(),
    type: user.type,
    created_date: user.created_date,
  };

  if (options) return jwt.sign(payload, settings.config.expressJwt.secret, options);
  else return jwt.sign(payload, settings.config.expressJwt.secret);
};

const verifyJwtToken = token => {
  let result;
  try {
    result = jwt.verify(token, settings.config.expressJwt.secret);
  } catch (error) {
    if (error.message === 'jwt expired') {
      throwError('jwt expired', 401);
    } else if (error.message === 'jwt must be provided') {
      throwError('jwt must be provided', 403);
    } else {
      throw error;
    }
  }
  return result;
};

const verifyEmailVerificationJwtToken = token => {
  let result;
  try {
    result = jwt.verify(token, settings.config.expressJwt.secret);
  } catch (error) {
    return { code: 401 };
  }
  return result;
};

export { createJwtToken, verifyJwtToken, verifyEmailVerificationJwtToken };
