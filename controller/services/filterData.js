module.exports.removeSensativeData = function removeSensativeData(userDoc, sendOptions) {
  if (userDoc) {
    userDoc.passwordHash = undefined;
    userDoc.salt = undefined;
    if (!sendOptions) sendOptions = {};
    if (!sendOptions.jwtToken) userDoc.jwtToken = undefined;
    if (!sendOptions.verifyEmailKey) userDoc.verifyEmailToken = undefined;
    if (!sendOptions.forgetPasswordKey) userDoc.forgetPasswordKey = undefined;
  }
  return userDoc;
};

function filterWhiteListFields(obj, whitelist) {
  let filteredObj = {};
  for (let key in obj) {
    if (whitelist.includes(key)) {
      filteredObj[key] = obj[key];
    }
  }
  return filteredObj;
}
