import { createJwtToken, verifyJwtToken } from '../services/jwtToken.js';
import users from '../../model/mongoose/users.js';
import { throwError } from '../services/errors.js';

const getUserFromToken = async req => {
  if (!req.auth) {
    let token = req.headers.authorization;
    console.log(token);
    let payload = verifyJwtToken(token);
    const user = await users.findOneById(payload.id);
    console.log(user?.jwtToken);
    console.log(user?.jwtToken === token);
    if (user.jwtToken !== token) throwError('Jwt token not found', 401);
    req.auth = {
      user: user,
    };
  }
};

const isLoggedIn = async req => {
  await getUserFromToken(req);
};

const isSuperAdmin = async req => {
  await getUserFromToken(req);
  if (!req?.auth?.user?.superAdmin) {
    return throwError('Not authorized', 401);
  }
};

const isCompanyAdmin = async req => {
  await getUserFromToken(req);
  if (!req?.auth?.user?.companyAdmin) {
    return throwError('Not authorized', 401);
  }
};

const isValidUser = async user => {
  if (!user?.isVerified) {
    return throwError('User is not verified', 403);
  }
  if (!user?.isApproved) {
    return throwError('User not approved', 403);
  }
  if (user?.isDeleted) {
    return throwError('User account is disabled', 403);
  }
};

const isValidSupplier = async req => {
  await getUserFromToken(req);
  let user = req.auth.user;
  if (user.type !== 'supplier') errors.throwError('User is not a supplier', 403);
  if (!user.is_verify) errors.throwError('User is not verified', 403);
  // if (user.disable_account !== false) errors.throwError("User account was dissabled", 403);
};

const isSupplierType = async req => {
  await getUserFromToken(req);
  let user = req.auth.user;
  if (user.type !== 'supplier') {
    errors.throwError('Can only be called by a supplier');
  }
};

const isDistributorType = async req => {
  await getUserFromToken(req);
  let user = req.auth.user;
  if (user.type !== 'distributor') {
    errors.throwError('Can only be called by a distributor');
  }
};

export { isCompanyAdmin, isValidUser, isSuperAdmin };
