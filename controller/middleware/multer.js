const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const settings = require('../../settings');
const sanitize = require('../services/sanitize');
const logger = require('../services/logger');

let appMulter;

if (settings.ENVIRONMENT === 'staging' || settings.ENVIRONMENT === 'production') {
  logger.info('Configuring multer with S3 bucket');
  aws.config.update({
    region: settings.AWS.REGION,
  });

  let s3 = new aws.S3();

  appMulter = multer({
    storage: multerS3({
      s3: s3,
      bucket: settings.AWS.BUCKETS.files,
      key: function (req, file, cb) {
        logger.debug('file', { file: file });
        let folder = '';
        if (file.mimetype == 'application/pdf') {
          folder = 'resume/';
        } else if (file.mimetype.indexOf('image') > -1) {
          folder = 'images/';
        }
        const originalname = sanitize.recursivelySanitize(file.originalname);
        cb(null, folder + Date.now().toString() + '/' + originalname);
      },
      acl: 'public-read',
    }),
  });
} else {
  logger.info('Configuring local multer to /uploads folder');

  appMulter = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'uploads');
      },
      filename: function (req, file, cb) {
        const originalname = sanitize.recursivelySanitize(file.originalname);
        cb(null, Date.now().toString() + originalname);
      },
    }),
  });
}

const uploadOneFile = async function (req, name) {
  await new Promise(function (res, rej) {
    try {
      appMulter.single(name)(req, {}, function (err) {
        if (err) {
          console.log(err);
          rej(err);
        }
        res();
      });
    } catch (err) {
      console.log(err);
      rej(err);
    }
  });
  if (req.file) {
    if (settings.ENVIRONMENT === 'staging' || settings.ENVIRONMENT === 'production') {
      req.file.path = req.file.location; // for S3 bucket
      // req.file.path = settings.FILE_URL + req.file.filename;
    } else {
      req.file.path = settings.FILE_URL + req.file.filename;
    }
  }
};

module.exports = appMulter;
module.exports.uploadOneFile = uploadOneFile;
