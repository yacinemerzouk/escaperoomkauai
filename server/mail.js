// SMTP SETTINGS
// TODO: move this to settings / package
process.env.MAIL_URL = "smtp://info@escaperoomkauai.com:Ozozw27NMX@secure.emailsrvr.com:465/";

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

        Email.send({
            to: to,
            bcc: 'notifications@zendy.net',
            from: from,
            subject: subject,
            html: text
        });

    }

});