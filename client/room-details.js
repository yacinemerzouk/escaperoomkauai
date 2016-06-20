Template.room.onRendered(function(){
    var defaultDate;
    if( Session.get( 'selectedDate' ) ){
        defaultDate = Session.get( 'selectedDate' );
    }else{
        defaultDate = Epoch.dateObjectToDateString(new Date());
        Session.set( 'selectedDate', defaultDate );
    }

    $('#datepicker').datepicker({
        minDate: 0,
        dateFormat: 'yy-mm-dd',
        defaultDate: defaultDate,
        onSelect: function( dateText, inst ){
            $('.ui-state-highlight').removeClass("ui-state-highlight");
            Session.set( 'selectedDate', dateText );
            Session.set( 'selectedTime', false );
        }
    });

});

Template.room.helpers({
    selectedDate: function(){
        return Session.get('selectedDate');
    },
    selectedTime: function(){
        return Session.get('selectedTime');
    },
    nbPlayersOptions: function(  ){
        var nbPlayersOptions = [];
        var spotsLeft = EscapeRoom.spotsLeft( this._id, Session.get('selectedDate'), Session.get('selectedTime') );
        if( this ){
            for( var x = this.minPlayers; x <= this.maxPlayers; x++ ){
                if( x <= spotsLeft ) {
                    nbPlayersOptions.push(x);
                }
            }
        }
        return nbPlayersOptions;
    },
    selectedNbPlayers: function(){
        return Session.get('selectedNbPlayers');
    },
    selectedCloseRoom: function(){
        return Session.get('selectedCloseRoom');
    },
    calculatedNbPlayersCost: function(){
        if( Session.get('selectedNbPlayers') ){
            return parseInt( Session.get('selectedNbPlayers') ) * this.pricePerPlayer;
        }else{
            return false;
        }
    },
    calculatedCloseRoomCost: function(){
        if( Session.get('selectedCloseRoom') ){
            return  this.priceToClose;
        }else{
            return false;
        }
    },
    calculatedTotal: function(){
        var nbPlayersCost;
        var closeRoomCost;
        if( Session.get('selectedNbPlayers') ){
            nbPlayersCost = parseInt( Session.get('selectedNbPlayers') ) * this.pricePerPlayer;
        }else{
            nbPlayersCost = 0;
        }
        if( Session.get('selectedCloseRoom') && EscapeRoom.canClose( this._id, Session.get('selectedDate'), Session.get('selectedTime') ) ){
            closeRoomCost = this.priceToClose;
        }else{
            closeRoomCost = 0;
        }
        return nbPlayersCost + closeRoomCost;
    },
    enteredFirstName: function(){
        return Session.get('enteredFirstName');
    },
    enteredLastName: function(){
        return Session.get('enteredLastName');
    },
    enteredEmail: function(){
        return Session.get('enteredEmail');
    },
    enteredPhone: function(){
        return Session.get('enteredPhone');
    },
    enteredcc: function(){
        return Session.get('enteredcc');
    },
    enteredccExpMonth: function(){
        return Session.get('enteredccExpMonth');
    },
    enteredccExpYear: function(){
        return Session.get('enteredccExpYear');
    },
    enteredcvv: function(){
        return Session.get('enteredcvv');
    },
    canClose: function(){
        return EscapeRoom.canClose( this._id, Session.get('selectedDate'), Session.get('selectedTime') );
    }
});

Template.room.events({
    'change [hook="enteredFirstName"]': function(evt,tmpl){
        Session.set('enteredFirstName',evt.target.value);
    },
    'change [hook="enteredLastName"]': function(evt,tmpl){
        Session.set('enteredLastName',evt.target.value);
    },
    'change [hook="enteredEmail"]': function(evt,tmpl){
        Session.set('enteredEmail',evt.target.value);
    },
    'change [hook="enteredPhone"]': function(evt,tmpl){
        Session.set('enteredPhone',evt.target.value);
    },
    'change [hook="enteredcc"]': function(evt,tmpl){
        Session.set('enteredcc',evt.target.value);
    },
    'change [hook="enteredccExpMonth"]': function(evt,tmpl){
        Session.set('enteredccExpMonth',evt.target.value);
    },
    'change [hook="enteredccExpYear"]': function(evt,tmpl){
        Session.set('enteredccExpYear',evt.target.value);
    },
    'change [hook="enteredcvv"]': function(evt,tmpl){
        Session.set('enteredcvv',evt.target.value);
    },
    'click [hook="set-time"]': function(evt,tmpl){
        evt.preventDefault();
        if( $(evt.currentTarget).hasClass('button-unavailable') && Session.get('selectedTime') ){
            Notifications.error('Too many players.','There are not enough spots left for the number of players you selected.');
        }else{
            Session.set( 'selectedTime', $(evt.currentTarget).attr('hook-data') );
        }
    },
    'change [hook="nbPlayers"]': function(evt,tmpl){
        var nbPlayers = $(evt.currentTarget).val();
        if( nbPlayers == '0' ){
            nbPlayers = false;
        }
        Session.set( 'selectedNbPlayers', nbPlayers );
    },
    'change [hook="closeRoom"]': function(evt,tmpl){
        var closeRoom = $(evt.target).is(':checked');
        Session.set( 'selectedCloseRoom', closeRoom );
    },
    'click [hook="checkout"]': function(evt,tmpl){


        var nbPlayersCost;
        var closeRoomCost;
        if( Session.get('selectedNbPlayers') ){
            nbPlayersCost = parseInt( Session.get('selectedNbPlayers') ) * this.pricePerPlayer;
        }else{
            nbPlayersCost = 0;
        }
        if( Session.get('selectedCloseRoom') && EscapeRoom.canClose( this._id, Session.get('selectedDate'), Session.get('selectedTime') ) ){
            closeRoomCost = this.priceToClose;
        }else{
            closeRoomCost = 0;
        }
        var total = nbPlayersCost + closeRoomCost;

        Stripe.card.createToken({
            number: Session.get('enteredcc'),
            exp_month: Session.get('enteredccExpMonth'),
            exp_year: Session.get('enteredccExpYear'),
            cvc: Session.get('enteredcvv'),
        }, function(status, response) {
            var stripeToken = response.id;
            Meteor.call('chargeCard', stripeToken, total, function(error, result){
                console.log( 'callback from chargeCard', error, result );
                if( error ){
                    Notifications.error( 'Error', 'Sorry. We could not process your card. Please call 808.635.6957' );
                }else if( result ){

                    var publicId;
                    var lastRes = EscapeRoom.Collections.Reservations.findOne({},{sort:{publicId:-1}});

                    if( lastRes && lastRes.publicId ){
                        publicId = lastRes.publicId + 1;
                    }else{
                        publicId = 350000
                    }

                    var resId = EscapeRoom.Collections.Reservations.insert({
                        publicId: publicId,
                        roomId: tmpl.data._id,
                        date: Session.get('selectedDate'),
                        time: Session.get('selectedTime'),
                        firstName: Session.get('enteredFirstName'),
                        lastName: Session.get('enteredLastName'),
                        email: Session.get('enteredEmail'),
                        phone: Session.get('enteredPhone'),
                        nbPlayers: Session.get('selectedNbPlayers'),
                        closeRoom: EscapeRoom.canClose( tmpl.data._id, Session.get('selectedDate'), Session.get('selectedTime') ) && Session.get('selectedCloseRoom') ? true : false,
                        transaction: result
                    });

                    if( resId ){
                        Meteor.call(
                            'sendEmail',
                            Session.get('enteredEmail'),
                            '"Kauai Escape Room" info@escaperoomkauai.com',
                            'Booking confirmation - RESERVATION #' + publicId,
                            EscapeRoom.getConfirmationEmailBody(resId),
                            function (error,result) {
                                if( error ){
                                    throw new Meteor.Error( 'MAILER_ERROR', 'Error while sending booking confirmation. ERROR ||| RES => ' + JSON.stringify( error ) ) ;
                                }
                            }
                        );
                        Router.go('confirmation', {_id:resId});
                    }else{
                        Notifications.error('Charge OK but Reservation failed', 'Please call 808.635.6957');
                    }
                }else{
                    Notifications.error( 'Error', 'Sorry. We could not process your card. Please call 808.635.6957' );
                }
            });
        });

    }
});