/**
 * =============================================================
 * DATA CONTEXT
 * Template data: none
 * Router subscriptions: roomsMeta, games (today)
 * Template subscriptions: none
 * =============================================================
 */
 
/**
 * =============================================================
 * TEMPLATE CREATED
 * =============================================================
 */
Template.waiver.onCreated(function(){});

/**
 * =============================================================
 * TEMPLATE RENDERED
 * =============================================================
 */
Template.waiver.onRendered(function(){

});


/**
 * =============================================================
 * TEMPLATE DESTROYED
 * =============================================================
 */
Template.waiver.onDestroyed(function(){});

/**
 * =============================================================
 * TEMPLATE EVENTS
 * =============================================================
 */
Template.waiver.events({

    /**
     * Toggle legal text
     * @param evt
     * @param tmpl
     */
    'click [hook="toggle-legalese"]': function(evt,tmpl){
        var legalese = $('[hook="legalese"]');
        if( legalese.is(':visible') ){
            legalese.hide();
        }else{
            legalese.show();
        }
    },

    /**
     * Check / uncheck 'I am 18' box
     * @param evt
     * @param tmpl
     */
    'change [hook="adult"]': function(){
        var adult = $('[hook="adult"]');
        if( adult.is(':checked') ){
            $('[hook="adult-form"]').show();
        }else{
            $('[hook="adult-form"]').hide();
        }
    },

    /**
     * Select onchange event
     * @param evt
     * @param tmpl
     */
    'change [hook="room"]': function(evt,tmpl){
        var roomId = evt.currentTarget.value;
        var room = Bolt.Collections.Rooms.findOne(roomId);
        var boltUI = Session.get('boltUI') || {};
        boltUI.waiver = boltUI.waiver || {};
        boltUI.waiver.room = room;
        Session.set('boltUI',boltUI);
    },

    /**
     * Form submission handler
     * @param evt
     * @param tmpl
     */
    'submit [hook="submit-waiver"]': function(evt,tmpl){

        evt.preventDefault();

        var formData = Bureaucrat.getFormData( $('[hook="submit-waiver"]') );

        isWaiverValid = true;

        if( !formData.game || formData.game == "0" ){
            isWaiverValid = false;
            Notifications.error( "Please select game." );
        }

        if( !formData.name || formData.name == "" ){
            isWaiverValid = false;
            Notifications.error( "Please enter your name." );
        }

        if( $('[hook="adult"]').is(':checked') ){

            if( !formData.email || formData.email == "" ){
                isWaiverValid = false;
                Notifications.error( "Please enter your email address." );
            }

            if( !formData.agree ){
                isWaiverValid = false;
                Notifications.error( "You must agree to the terms of the waiver and release of liability." );
            }

        }

        if( isWaiverValid ) {

            var game = new Bolt.Game(formData.game);

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
                    // var mailChimp = new MailChimp("4dea6fda5950407d6090b15f60b3755f-us13");
                    var mailChimp = new MailChimp( Meteor.settings.private.MailChimp.apiKey );

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


/**
 * =============================================================
 * TEMPLATE HELPERS
 * =============================================================
 */
Template.waiver.helpers({
    rooms: function(){
        return Bolt.Collections.Rooms.find({available:true});
    },
    games: function(){
        var today = Epoch.dateObjectToDateString( new Date() );
        return Bolt.Collections.Games.find({ date: today, roomId: { $ne: "any" } },{sort:{time:1}});
    },
    boltUI: function(){
        return Session.get('boltUI');
    }
});