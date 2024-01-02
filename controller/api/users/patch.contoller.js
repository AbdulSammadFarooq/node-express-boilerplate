const Schema = require('mongoose').Schema;
const regexes = require('../../../model/regexes');
const jwtToken = require('../../services/jwtToken');
const users = require('../../../model/mongoose/users');
const errors = require('../../services/errors');
const crypto = require('../../services/crypto');
const multer = require('../../middleware/multer');
const enums = require('../../../model/enumerations');
const filterData = require('../../services/filterData');

module.exports.request = {
  type: 'patch',
  path: '/users',
};
const bodySchema = new Schema({});
module.exports.inputValidation = {
  body: bodySchema,
};
module.exports.files = async function (req) {
  await multer.uploadOneFile(req, 'image'); // for uploading files
};
module.exports.endpoint = async function (req, res) {
  let queryBody = req.body;
  if (req.file && req.file.path) {
    // here use the path of uploaded file
  }
  res.send({});
};
