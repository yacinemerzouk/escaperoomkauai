// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');

// SMTP SETTINGS
// process.env.MAIL_URL = Meteor.settings.private.smtp.MAIL_URL;

/**
 * Meteor methods for mail
 */
Meteor.methods({

    /**
     * Send an email via system
     * @param to
     * @param from
     * @param subject
     * @param text
     */
    sendEmail: function (to, from, subject, text) {
        check([to, from, subject, text], [String]);

        // Let other method calls from the same client start running,
        // without waiting for the email sending to complete.
        this.unblock();

        // Email.send({
        //     to: to,
        //     bcc: Meteor.settings.private.smtp.bcc,
        //     from: from,
        //     subject: subject,
        //     html: text
        // });

        try {

            sgMail.setApiKey(Meteor.settings.private.SENDGRID_API_KEY);

            const msg = {
                to,
                from: from || 'Kauai Escape Room <info@escaperoomkauai.com>',
                subject,
                html: text,
            };

            console.log('Sending sgMail', msg,  Meteor.settings.private.SENDGRID_API_KEY);

            return sgMail.send(msg).then(function() {

                console.log('It worked')
                return true;

            }).catch(function(error) {

                console.log(error)
                return error;

            });

        } catch (error) {

            return error;

        }

    }

});
