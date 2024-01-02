import users from '../../../../../model/mongoose/users.js';
import { verifyJwtToken } from '../../../../services/jwtToken.js';
import { throwError } from '../../../../services/errors.js';
import { Schema } from 'mongoose';
const request = {
  type: 'post',
  path: '/user/verify',
};

const bodySchema = new Schema({
  token: String,
});

const inputValidation = {
  body: bodySchema,
};

const endpoint = async (req, res) => {
  let queryBody = req.body;
  const decodedToken = verifyJwtToken(queryBody?.token);
  const userDoc = await users.findOneById({ _id: decodedToken?.id });
  if (userDoc) {
    if (userDoc?.isVerified) {
      return throwError('Email already verified', 409);
    }
    const updatedObj = {
      isVerified: true,
    };
    await users.updateOne({ _id: userDoc._id }, updatedObj);
    return res.send({
      success: true,
      message: 'Email verified successfully',
    });
  } else {
    throwError('User not found', 404);
  }
};

export { request, inputValidation, endpoint };
