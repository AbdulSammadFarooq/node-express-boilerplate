import users from '../../../../../../model/mongoose/users.js';
import {
  createJwtToken,
  verifyEmailVerificationJwtToken,
} from '../../../../../services/jwtToken.js';
import { throwError } from '../../../../../services/errors.js';
import { Schema } from 'mongoose';
import sendForgetPasswordEmail from '../../../../../services/email/forgetPasswordEmail.js';
const request = {
  type: 'post',
  path: '/users/auth/password/forget',
};

const bodySchema = new Schema({
  email: String,
});

const inputValidation = {
  body: bodySchema,
};

const endpoint = async (req, res) => {
  let queryBody = req.body;
  const userDoc = await users.findOne({ email: queryBody.email });
  if (userDoc) {
    let forgotPasswordToken;
    const validatePreviousForgetPasswordToken = verifyEmailVerificationJwtToken(
      userDoc?.forgotPasswordKey,
    );
    if (validatePreviousForgetPasswordToken?.code === 401) {
      forgotPasswordToken = createJwtToken(userDoc, {
        expiresIn: '1h',
      });
    } else {
      return throwError(
        `We have already sent you an email. Kindly check your email to reset your password or re-try after an hour`,
        400,
      );
    }
    await users.updateOne(
      { _id: userDoc._id },
      { $set: { forgotPasswordKey: forgotPasswordToken } },
    );
    sendForgetPasswordEmail(userDoc?.email, 'Reset your password', forgotPasswordToken);
    return res.send({
      success: true,
      message: 'Email sent to provided email to reset your password',
    });
  } else {
    throwError('User not found', 404);
  }
};

export { request, inputValidation, endpoint };
