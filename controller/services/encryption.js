var CryptoJS = require('crypto-js');
var encryptMethodLength = () => {
  var aesNumber = encryptMethod.match(/\d+/)[0];
  return parseInt(aesNumber);
};
var encryptMethod = () => {
  return 'AES-256-CBC';
};
module.exports.encrypt = (val, key) => {
  var encrypted = CryptoJS.AES.encrypt(JSON.stringify(val), key, {
    format: CryptoJSAesJson,
  }).toString();
  return encrypted;
};
module.exports.decrypt = (encryptedString, key) => {
  var decrypted = JSON.parse(
    CryptoJS.AES.decrypt(encryptedString, key, { format: CryptoJSAesJson }).toString(
      CryptoJS.enc.Utf8,
    ),
  );
  return decrypted;
};
var CryptoJSAesJson = {
  stringify: function (cipherParams) {
    var j = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) };
    if (cipherParams.iv) j.iv = cipherParams.iv.toString();
    if (cipherParams.salt) j.s = cipherParams.salt.toString();
    return JSON.stringify(j);
  },
  parse: function (jsonStr) {
    var j = JSON.parse(jsonStr);
    var cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(j.ct),
    });
    if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv);
    if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s);
    return cipherParams;
  },
};
