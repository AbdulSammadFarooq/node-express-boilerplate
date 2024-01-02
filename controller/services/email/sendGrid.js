const settings = require('../../../settings');
const logger = require('../logger');
const sgMail = require('@sendgrid/mail');
const sgClient = require('@sendgrid/client');

if (settings.isLiveApplication) {
    logger.debug("Setting Sendgrid API key");
    sgMail.setApiKey(settings.SENDGRID.API_KEY);
    sgClient.setApiKey(settings.SENDGRID.API_KEY);
}

module.exports.sendEmail = async function sendEmail(sendGridOptions) {
    const defaultFrom = {
        name: settings.SENDGRID.FROM_NAME,
        email: settings.SENDGRID.FROM_ADDRESS
    }

    sendGridOptions.templateData.subject = sendGridOptions.subject;

    const msg = {
        personalizations: sendGridOptions.personalizations,
        from: sendGridOptions.from ? sendGridOptions.from : defaultFrom,
        subject: sendGridOptions.subject,
        templateId: sendGridOptions.templateId,
        dynamic_template_data: sendGridOptions.templateData
    };
    logger.debug("Send email msg object: ", msg);

    try {
        await sgMail.send(msg);
        logger.debug('Sucessfully sent to ' + sendGridOptions.personalizations[0].to.email);
    } catch (error) {
        logger.error('There was an error sending the message to ' + sendGridOptions.personalizations[0].to.email, error, {message: msg});
    }
}