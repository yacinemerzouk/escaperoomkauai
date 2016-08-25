Meteor.methods({
    'sendSMS': function( message ){
        // Configure the Twilio client
        var client = new Twilio({
            from: Meteor.settings.TWILIO.FROM,
            sid: Meteor.settings.TWILIO.SID,
            token: Meteor.settings.TWILIO.TOKEN
        });

        // Send a message
        return client.sendSMS({
            to: '+18086342466',
            body: message
        });


    }
})