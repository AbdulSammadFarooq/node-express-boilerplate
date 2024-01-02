import settings from '../../../settings.js';
import transporter from './nodemailerTransporter.js';
import sendEmail from './emails.js';
const sendForgetPasswordEmail = async (toEmail, subject, verifyToken) => {
  const verifyEmailUrl = `${settings.config.client.url}resetPassword/${verifyToken}`;
  const mailOptions = {
    from: 'Loyalities <no-reply@whatsapp.mwancloud.com>',
    to: toEmail,
    subject: subject,
    text: `Please click on the following link to reset your password: ${verifyEmailUrl}`, // the link to verify the email
  };
  sendEmail(transporter, mailOptions);
};
export default sendForgetPasswordEmail;
