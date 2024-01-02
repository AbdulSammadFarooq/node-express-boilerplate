import production from './config/production.json' assert { type: 'json' };
import staging from './config/staging.json' assert { type: 'json' };
import development from './config/dev.json' assert { type: 'json' };
import local from './config/local.json' assert { type: 'json' };
let settings = {
  config: {},
  version: 'v1',
  isLiveApplication: false,
};
let config;
if (process.env.NODE_ENV === 'production') {
  settings.ENVIRONMENT = 'production';
  config = production;
} else if (process.env.NODE_ENV === 'staging') {
  settings.ENVIRONMENT = 'staging';
  config = staging;
} else if (process.env.NODE_ENV === 'development') {
  settings.ENVIRONMENT = 'dev';
  config = development;
} else {
  process.env.NODE_ENV = 'local';
  settings.ENVIRONMENT = 'local';
  config = local;
}
settings.appKey = '$QP]H{g]6U;&_Z%';

const isLiveApplication = (settings.isLiveApplication = function () {
  return settings.ENVIRONMENT === 'production' || settings.ENVIRONMENT === 'staging';
});
if (isLiveApplication()) {
  config.mongo.username = process.env.MONGO_DATABASE_USERNAME;
  config.mongo.password = process.env.MONGO_DATABASE_PASSWORD;
  config.sendGrid.apiKey = process.env.SENDGRID_API_KEY;

  settings.MONGO_CONNECTION_STRING =
    'mongodb://' +
    config.mongo.username +
    ':' +
    config.mongo.password +
    '@' +
    config.mongo.host +
    ':' +
    config.mongo.port +
    '/' +
    config.mongo.databaseName +
    '?' +
    config.mongo.options;
  config.expressJwt.secret = process.env.EXPRESS_JWT_SECRET;
} else {
  settings.MONGO_CONNECTION_STRING =
    'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.databaseName;
}
settings.isLiveApplication = isLiveApplication();
settings.config = config;
export default settings;
