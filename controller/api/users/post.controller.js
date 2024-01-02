import { Schema } from 'mongoose';
import { email } from '../../../model/regexes.js';
import { createJwtToken } from '../../services/jwtToken.js';
import users from '../../../model/mongoose/users.js';
import companies from '../../../model/mongoose/companies.js';
import { throwError } from '../../services/errors.js';
import { getRandomString, createPasswordHash } from '../../services/crypto.js';
import sendVerifyEmail from '../../services/email/verifyEmail.js';
import { isCompanyAdmin, isValidUser } from '../../middleware/auth.js';
const request = {
  type: 'post',
  path: '/user/create',
};

const auth = async req => {
  await isCompanyAdmin(req);
  await isValidUser(req?.auth?.user);
};
const bodySchema = new Schema({
  email: {
    type: String,
    validate: email,
    lowercase: true,
  },
  companyId: {
    type: String,
    required: true,
  },
  password: String,
  firstName: String,
  lastName: String,
});
const inputValidation = {
  body: bodySchema,
};
const endpoint = async (req, res) => {
  let queryBody = req.body;
  // check email is available or not
  let userDoc = await users.findOne({ email: queryBody.email });
  if (userDoc) {
    throwError(`User with this email ${queryBody.email} already exist`, 409);
    return;
  }
  // check company existence
  const isCompanyExists = await companies.findOneById({ _id: queryBody.companyId });
  if (!isCompanyExists) {
    throwError(`Company not found`, 404);
  }
  // create company
  let newUser = {
    email: queryBody.email,
    firstName: queryBody.firstName,
    lastName: queryBody.lastName,
    companyUser: true,
    company: isCompanyExists._id,
    isApproved: true,
  };
  if (queryBody.password) {
    const salt = getRandomString(128);
    let passwordHash = createPasswordHash(queryBody.password, salt);
    newUser.password = passwordHash;
    newUser.salt = salt;
  }

  userDoc = await users.insert(newUser);
  let jwtData = {
    _id: userDoc._id,
    email: queryBody.email,
  };
  let jwtUserToken = createJwtToken(jwtData);
  let verifyEmailToken = createJwtToken(jwtData, {
    expiresIn: '1h',
  });
  let updatedObj = {
    jwtToken: jwtUserToken,
    verifyEmailToken: verifyEmailToken,
  };
  userDoc = await users.updateOne({ _id: userDoc._id }, updatedObj);
  sendVerifyEmail(queryBody.email, 'Verify your email address', verifyEmailToken);
  return res.send({
    success: true,
    message: `Email is sent to ${queryBody.email}. Verify your email`,
  });
};

export { request, inputValidation, endpoint, auth };
