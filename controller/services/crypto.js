import crypto from 'crypto';

const getRandomString = length => {
  if (length > 128) throw new Error('Length must be less than 128 characters');

  let randomString = crypto.randomBytes(16).toString('base64');
  return randomString.substr(1, length);
};

const createPasswordHash = (password, salt) => {
  let hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  return hash.digest('hex');
};

const comparePasswords = (enteredPassword, storedHashedPassword, salt) => {
  const hashedEnteredPassword = createPasswordHash(enteredPassword, salt);
  return hashedEnteredPassword === storedHashedPassword;
};

export { getRandomString, createPasswordHash,comparePasswords };
