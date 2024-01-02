import rootpath from 'rootpath';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import settings from './settings.js';
import logger from './controller/services/logger.js';
import requestLogger from './controller/middleware/requestLogger.js';
import errorHandler from './controller/middleware/errorHandler.js';
import router from './routes.js';
let app = express();
try {
  rootpath();
  app.use(cors());
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    }),
  );
  app.use(router);
  app.use(requestLogger);
  app.use(errorHandler);
  mongoose.connect(settings.MONGO_CONNECTION_STRING);

  mongoose.connection.on('connected', function () {
    logger.info('Connected to mongodb database');
  });

  mongoose.connection.on('error', function (error) {
    if (error) {
      logger.error(error.message, { stack: error.stack });
      process.exit(1);
    }
  });

  const port = settings.config.server.port;

  app.listen(port, function () {
    logger.info('Server listening on port ' + port);
  });
} catch (error) {
  logger.error(error.message, {
    stack: error.stack,
    name: error.name,
  });
}
