Meteor.methods({
    mailchimpSignup: function( email ){
        var mailChimp = new MailChimp( Meteor.settings.private.MailChimp.apiKey );

        // console.log( Meteor.settings.private.MailChimp.apiKey );
        // console.log( Meteor.settings.private.MailChimp.listId );

        mailChimp.call('lists', 'subscribe', {
                email: {email: email},
                update_existing: true,
                double_optin: false,
                id: Meteor.settings.private.MailChimp.listId
            },
            // Callback beauty in action
            function (error, result) {
                if (error) {
                    console.error('[MailChimp][Lists][Subscribe] Error:', error);
                } else {
                    // Do something with your data!
                    // console.info('[MailChimp][Lists][Subscribe]: %o', result);
                }
            }
        );
    }
});