Meteor.methods({
    'sendSMS': function( message, number ){
        // Configure the Twilio client
        var client = new Twilio({
            from: Meteor.settings.TWILIO.FROM,
            sid: Meteor.settings.TWILIO.SID,
            token: Meteor.settings.TWILIO.TOKEN
        });

        // Send a message
        var to = number || '+18086315949';
        if( Meteor.settings.private.SMS.env == "dev"){
            to = '+18086342466';
        }
        if( number)
        return client.sendSMS({
            to: to,
            body: message
        });
    },
    sendAdminNotificationSMS: function( message ){
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
                body: message
            });
            if(!sent){
                notificationsSent = false;
            }
        });

        // // Send a message
        // var yacine = client.sendSMS({
        //     to: '+18086342466',
        //     body: message
        // });
        //
        // // Send a message
        // var michelle = client.sendSMS({
        //     to: '+18086525224',
        //     body: message
        // });

        return notificationsSent;
    }
})