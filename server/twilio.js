Meteor.methods({

    'sendSMS': function( message, number ){

        this.unblock();

        console.log('sendSMS 1/x');

        // Configure the Twilio client
        var client = new Twilio({
            from: Meteor.settings.TWILIO.FROM,
            sid: Meteor.settings.TWILIO.SID,
            token: Meteor.settings.TWILIO.TOKEN
        });

        console.log('sendSMS 2/x');

        // Send a message
        var to = number || '+18086315949';

        console.log('sendSMS 3/x');

        if( Meteor.settings.private.SMS.env == "dev"){
            to = '+18086342466';
            message = '[TEST] ' + message;
        }

        console.log('sendSMS 4/x');

        if( number)
        var success = client.sendSMS({
            to: to,
            body: message
        });

        console.log('sendSMS 5/x');

        return success;

    },
    sendAdminNotificationSMS: function( message ){

        this.unblock();

        // Configure the Twilio client
        var client = new Twilio({
            from: Meteor.settings.TWILIO.FROM,
            sid: Meteor.settings.TWILIO.SID,
            token: Meteor.settings.TWILIO.TOKEN
        });

        var notifications = Meteor.settings.private.SMS.notifications;
        var notificationsSent = true;

        _.each( notifications, function( n ){

            var sent = client.sendSMS({
                to: n,
                body: Meteor.settings.private.SMS.env == "dev" ? '[TEST] ' + message : message
            });

            if(!sent){
                notificationsSent = false;
            }

        });

        return notificationsSent;

    }

});
