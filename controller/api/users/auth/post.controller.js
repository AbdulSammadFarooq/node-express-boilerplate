import { Schema } from 'mongoose';
import regexes from '../../../../model/regexes.js';
import jwtToken from '../../../services/jwtToken.js';
import users from '../../../../model/schemas/users.js';
import errors from '../../../services/errors.js';
import crypto from '../../../services/crypto';

export const request = {
  type: 'post',
  path: '/users/auth',
};
const bodySchema = new Schema({
  email: {
    type: String,
    validate: regexes.email,
    lowercase: true,
  },
  password: {
    type: String,
    validate: regexes.password,
  },
});
export const inputValidation = {
  body: bodySchema,
};
export const endpoint = async function (req, res) {
  let queryBody = req.body;
  let userDoc = await users.findOne({ email: queryBody.email });
  if (!userDoc) {
    errors.throwError('User not found', 404);
    return;
  }
  let passwordHash = crypto.createPasswordHash(queryBody.password, userDoc.salt);
  if (passwordHash != userDoc.passwordHash) {
    errors.throwError('Password not correct', 400);
  } else {
    let jwtUserToken = jwtToken.createJwtToken({
      _id: userDoc._id,
      email: userDoc.email,
    });
    await users.updateOne(
      { _id: userDoc._id },
      { jwtToken: jwtUserToken, sessionStarted: new Date() },
    );
    res.send({
      _id: userDoc._id,
      email: queryBody.email,
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      jwtToken: jwtUserToken,
      isVerified: userDoc.isVerified,
    });
  }
};
