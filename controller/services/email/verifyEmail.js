import settings from '../../../settings.js';
import transporter from './nodemailerTransporter.js';
import sendEmail from './emails.js';
const sendVerifyEmail = async (toEmail, subject, verifyToken) => {
  const verifyEmailUrl = `${settings.config.client.url}verifyEmail/${verifyToken}`;
  const mailOptions = {
    from: 'Loyalities <no-reply@whatsapp.mwancloud.com>',
    to: toEmail,
    subject: subject,
    text: `Please click on the following link to verify your email address: ${verifyEmailUrl}`, // the link to verify the email
  };
  sendEmail(transporter, mailOptions);
};
export default sendVerifyEmail;
