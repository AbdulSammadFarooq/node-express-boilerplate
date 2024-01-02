import logger from '../logger.js';

const sendEmail = async (transporter, mailOptions) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Message sent: ${info.messageId}`);
  } catch (error) {
    console.log('Error:', error);
    logger.error(error.message, { stack: error.stack });
  }
};
export default sendEmail;
