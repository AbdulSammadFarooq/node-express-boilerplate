import { Schema } from 'mongoose';
import users from '../../../../../../model/mongoose/users.js';
import { throwError } from '../../../../../services/errors.js';
import { getRandomString, createPasswordHash } from '../../../../../services/crypto.js';
import { verifyJwtToken } from '../../../../../services/jwtToken.js';

const request = {
  type: 'patch',
  path: '/users/auth/password/reset',
};

const bodySchema = new Schema({
  forgetPasswordKey: String,
  newPassword: String,
});

const inputValidation = {
  body: bodySchema,
};

const endpoint = async (req, res) => {
  let queryBody = req.body;
  const decodeToken = verifyJwtToken(queryBody.forgetPasswordKey);
  const userDoc = await users.findOneById(decodeToken?.id);
  if (!userDoc) {
    return throwError('User not found', 404);
  }
  if (userDoc?.forgotPasswordKey !== queryBody?.forgetPasswordKey) {
    return throwError('Invalid token', 400);
  }
  const salt = getRandomString(128);
  const hashedPasswordAndSalt = createPasswordHash(queryBody.newPassword, salt);
  await users.updateOne(
    { _id: userDoc._id },
    { $set: { password: hashedPasswordAndSalt, salt: salt, forgotPasswordKey: '' } },
  );
  return res.send({
    success: true,
    msg: 'Password reset successfully',
  });
};

export { request, inputValidation, endpoint };
