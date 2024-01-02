import { Schema } from 'mongoose';
import { email } from '../../../model/regexes.js';
import { createJwtToken } from '../../services/jwtToken.js';
import users from '../../../model/mongoose/users.js';
import companies from '../../../model/mongoose/companies.js';
import { throwError } from '../../services/errors.js';
import { getRandomString, createPasswordHash } from '../../services/crypto.js';
import sendVerifyEmail from '../../services/email/verifyEmail.js';
const request = {
  type: 'post',
  path: '/company/create',
};
const bodySchema = new Schema({
  email: {
    type: String,
    validate: email,
    lowercase: true,
  },
  companyName: {
    type: String,
    required: true,
    lowercase: true,
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
  // company name must be unique
  const isCompanyAlreadyRegistered = await companies.findOne({
    companyName: queryBody.companyName.trim().toLowerCase(),
  });
  if (isCompanyAlreadyRegistered) {
    throwError(`Company already registered with name ${queryBody.companyName}`, 409);
    return;
  }
  // create company
  let newCompany = await companies.insert({
    companyName: queryBody.companyName.trim().toLowerCase(),
  });
  let newUser = {
    email: queryBody.email,
    firstName: queryBody.firstName,
    lastName: queryBody.lastName,
    company: newCompany?._id,
    companyAdmin: true,
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
  await companies.updateOne({ _id: newCompany?._id }, { userId: userDoc?._id });
  sendVerifyEmail(queryBody.email, 'Verify your email address', verifyEmailToken);
  return res.send({
    success: true,
    message: `Email is sent to ${queryBody.email}. Verify your email`,
  });
};

export { request, inputValidation, endpoint };
