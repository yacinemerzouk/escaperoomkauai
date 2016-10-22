Template.waiver.helpers({
    rooms: function(){
        return Bolt.Collections.Rooms.find({available:true});
    },
    boltUI: function(){
        return Session.get('boltUI');
    },
    allTimes: function(){
        return Bolt.getAdminStartTimes();
    }
});

Template.waiver.events({
    'change [hook="room"]': function(evt,tmpl){
        var roomId = evt.currentTarget.value;
        var room = Bolt.Collections.Rooms.findOne(roomId);
        var boltUI = Session.get('boltUI') || {};
        boltUI.waiver = boltUI.waiver || {};
        boltUI.waiver.room = room;
        Session.set('boltUI',boltUI);
    },
    'submit [hook="submit-waiver"]': function(evt,tmpl){
        evt.preventDefault();

        var formData = Bureaucrat.getFormData( $('[hook="submit-waiver"]') );
        //console.log( 'submitting waiver', formData );

        isWaiverValid = true;

        if( !formData.room || formData.room == "0" ){
            isWaiverValid = false;
            Notifications.error( "Please select game." );
        }

        if( !formData.time || formData.time == "0" ){
            isWaiverValid = false;
            Notifications.error( "Please select time." );
        }

        if( !formData.name || formData.name == "" ){
            isWaiverValid = false;
            Notifications.error( "Please enter your name." );
        }

        if( !formData.email || formData.email == "" ){
            isWaiverValid = false;
            Notifications.error( "Please enter your email address." );
        }

        if( !formData.agree ){
            isWaiverValid = false;
            Notifications.error( "You must agree to the terms of the waiver and release of liability." );
        }

        if( isWaiverValid ) {

            var game = new Bolt.Game({
                date: Epoch.dateObjectToDateString(new Date()),
                time: formData.time,
                roomId: formData.room
            });

            game.addPlayer({
                name: formData.name,
                email: formData.email
            });

            if (game.save()) {
                Notifications.success("THANK YOU!", "Waiver submitted successfully.");
                $('[name="name"],[name="email"]').val("");
                $('[name="agree"],[name="newsletter"]').prop('checked', false);

                if (formData.newsletter) {
                    // You can as well pass different parameters on each call
                    var mailChimp = new MailChimp("4dea6fda5950407d6090b15f60b3755f-us13");

                    mailChimp.call('lists', 'subscribe', {
                            email: {email: formData.email},
                            update_existing: true,
                            double_optin: false
                        },
                        // Callback beauty in action
                        function (error, result) {
                            if (error) {
                                console.error('[MailChimp][Lists][Subscribe] Error: %o', error);
                            } else {
                                // Do something with your data!
                                console.info('[MailChimp][Lists][Subscribe]: %o', result);
                            }
                        }
                    );
                }


            } else {
                Notifications.error("Could not submit waiver.", "Please ask game master for assistance.");
            }

        }



    }
});