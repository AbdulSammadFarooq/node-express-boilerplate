import nodemailer from 'nodemailer';
import settings from '../../../settings.js';

const transporter = nodemailer.createTransport({
  host: settings.config.emailConfig.host,
  port: settings.config.emailConfig.port,
  auth: {
    user: settings.config.emailConfig.userName,
    pass: settings.config.emailConfig.password,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
export default transporter;
