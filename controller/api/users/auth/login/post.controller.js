import { Schema } from 'mongoose';
import { email } from '../../../../../model/regexes.js';
import { createJwtToken, verifyEmailVerificationJwtToken } from '../../../../services/jwtToken.js';
import users from '../../../../../model/mongoose/users.js';
import { throwError } from '../../../../services/errors.js';
import { comparePasswords } from '../../../../services/crypto.js';
import sendVerifyEmail from '../../../../services/email/verifyEmail.js';
const request = {
  type: 'post',
  path: '/user/login',
};
const bodySchema = new Schema({
  email: {
    type: String,
    validate: email,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const inputValidation = {
  body: bodySchema,
};
const endpoint = async (req, res) => {
  let queryBody = req.body;
  // check user's existence
  let userDoc = await users.findOne({ email: queryBody.email });
  if (!userDoc) {
    throwError(`Invalid credentials`, 400);
    return;
  }
  let jwtData = {
    _id: userDoc._id,
    email: queryBody.email,
  };
  // check user soft-deletion
  if (userDoc?.isDeleted) {
    throwError(`User is disabled`, 403);
    return;
  }
  // check email is verified
  if (!userDoc?.isVerified) {
    const decodedToken = verifyEmailVerificationJwtToken(userDoc?.verifyEmailToken);
    if (decodedToken?.code === 401) {
      // create new token
      let verifyEmailToken = createJwtToken(jwtData, {
        expiresIn: '1h',
      });
      await users.updateOne({ _id: userDoc._id }, { verifyEmailToken: verifyEmailToken });
      sendVerifyEmail(queryBody.email, 'Verify your email address', verifyEmailToken);
      return throwError(
        `Your account is not verified yet! We sent an email to ${userDoc?.email}. Verify your email`,
        400,
      );
    } else {
      return throwError(
        `We have already sent you an email. Verify your email or re-try after an hour`,
        400,
      );
    }
  }
  // check user is Approved by superAdmin
  if (!userDoc?.isApproved) {
    throwError(`User not approved by admin`, 400);
    return;
  }
  // compare password
  const isValidPassword = comparePasswords(queryBody.password, userDoc?.password, userDoc?.salt);
  if (!isValidPassword) {
    throwError(`Invalid credentials`, 400);
    return;
  }

  let jwtUserToken = createJwtToken(jwtData);
  let verifyEmailToken = createJwtToken(jwtData, {
    expiresIn: '1h',
  });
  let updatedObj = {
    jwtToken: jwtUserToken,
    verifyEmailToken: verifyEmailToken,
  };
  userDoc = await users.updateOne({ _id: userDoc._id }, updatedObj);
  return res.send({
    _id: userDoc._id,
    email: queryBody.email,
    jwtToken: jwtUserToken,
    firstName: userDoc?.firstName,
    lastName: userDoc?.lastName,
    company: userDoc?.company,
    superAdmin: userDoc?.superAdmin,
    companyAdmin: userDoc?.companyAdmin,
    companyUser: userDoc?.companyUser,
  });
};

export { request, inputValidation, endpoint };
