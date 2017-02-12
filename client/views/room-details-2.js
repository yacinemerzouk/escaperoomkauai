Template.room2.onCreated(function(){
    this.updateReservation = function( formData ){

        var formData = formData || Bureaucrat.getFormData( $( '[hook="reservation-form"]' ) );
        var userSelections = Session.get( 'userSelections' ) || {};

        if( formData.coupon ) {
            formData.coupon = formData.coupon.toUpperCase();
        }

        //ok

        Session.set( 'userSelections', _.extend( userSelections, formData ) );
    }
    this.submitOrder = function(){

        Bolt.showProcessing();


        var formData = $( '[hook="reservation-form"]' );
        var userSelections = Session.get( 'userSelections' );
        if( formData.coupon ) {
            formData.coupon = formData.coupon.toUpperCase();
        }
        var room = this.data.room;
        var reservationData = _.extend( userSelections, formData );
        var reservation = new Bolt.Reservation(_.extend( reservationData, {roomId: room._id, room:room } ));
        // Grab room info
        var game = new Bolt.Game( Session.get('game') );
        //game.addReservation( reservation );

        console.log( 'SUBMIT ORDER', reservation, game );


        Stripe.card.createToken({
            number: reservation.cc,
            exp_month: reservation.ccExpMonth,
            exp_year: reservation.ccExpYear,
            cvc: reservation.cvv,
        }, function (status, response) {

            var stripeToken = response.id;

            Meteor.call(
                'chargeCard',
                stripeToken,
                reservation.total * 100,
                reservation.email,
                function( error, response ){
                    if( error ){
                        throw new Meteor.Error('|Bolt|chargeCard|Error', error.message );
                    }else{
                        console.log( 'Back from chargeCard' );
                        // Add transaction to reservation
                        reservation.transaction = response;
                        // Add amountPaid
                        reservation.amountPaid = reservation.total;
                        // Add res to game
                        var resId = game.addReservation( reservation );
                        console.log( 'added reservation to game', game );
                        // Save game
                        var orderProcessed = game.save();

                        if( orderProcessed ){

                            reservation.sendConfirmationEmail();
                            //reservation.sendNotificationEmail();

                            // Configure the Twilio client
                            // var SMSString = "New Booking - " +
                            //     reservation.room.title +
                            //     " - " +
                            //     reservation.date +
                            //     " @ " +
                            //     reservation.time +
                            //     " - " +
                            //     reservation.nbPlayers + " players" +
                            //     " - " +
                            //     "$" + reservation.total;
                            // Meteor.call('sendAdminNotificationSMS', SMSString, function(error,response){
                            //     if( error ) {
                            //         // //console.log( error );
                            //         new Meteor.Error("[roomDetails][submitOrder][sendSMS] Error", error.message);
                            //     }else{
                            //         // //console.log( response );
                            //     }
                            //
                            // });


                            Bolt.hideProcessing();
                            Router.go( 'confirmation', {_id:resId});

                        }
                    }
                }
            );

        });



    }
});

Template.room2.onRendered(function(){

    // Subscribe to coupons
    Meteor.subscribe( 'coupons' );

    // Grab room info
    var room = this.data.room;

    this.autorun( function(){

        // Grab user selections
        var userSelections = Session.get( 'userSelections' ) || {};
        var date = userSelections.date || Epoch.today();
        var time = userSelections.time;

        // Set game data
        console.log( 'room2 autorun', room, date, time );
        var game = new Bolt.Game({
            roomId: room._id,
            date: date,
            time: time
        });
        console.log( 'SETTING GAME IN SESSION', game );
        Session.set( 'game', game );



        // Grab games for newly selected date
        // console.log('games not ready');
        Meteor.subscribe(
            'games',
            game.date,
            {
                onReady: function () {
                    // console.log('games ready');
                    Session.set('calendarDataReady', true);
                },
                onStop: function () {
                    //console.log('error in games subscription');
                }
            }
        );


        $('#datepicker').datepicker({
            minDate: Epoch.today(),
            dateFormat: 'yy-mm-dd',
            defaultDate: game.date,
            onSelect: function (dateText, inst) {
                Session.set('calendarDataReady', false);
                $('.ui-state-highlight').removeClass("ui-state-highlight");
                var formData = Bureaucrat.getFormData($('[hook="reservation-form"]'));
                if (formData) {
                    formData.date = dateText;
                    Session.set( 'userSelections', formData );
                }else{
                    throw new Meteor.Error( '|Bolt|Datepicker|Error', 'No form data when changing date' );
                }
            }
        });

    });

});

Template.room2.helpers({
    userSelections: function(){
        return Session.get( 'userSelections' );
    },
    reservation: function(){
        var userSelections = Session.get( 'userSelections' );
        var room = this.room;
        var res = new Bolt.Reservation( _.extend( userSelections, {roomId: room._id, room:room } ) );
        return res;
    },
    nbPlayersOptions: function( args ){
        var room = this.room;
        var nbPlayersOptions = [];
        if( Session.get( 'game' ) ) {
            var game = new Bolt.Game(Session.get('game'));
            var spotsLeft = game.getNbAvailableSpots();
            if (room) {
                for (var x = room.minPlayers; x <= room.maxPlayers; x++) {
                    if (x <= spotsLeft) {
                        nbPlayersOptions.push(x);
                    }
                }
            }
        }
        return nbPlayersOptions;
    },
    game: function(){
        return Session.get( 'game' );
    },
    games: function(){
        var game = new Bolt.Game( Session.get( 'game' ) );
        var games = Bolt.Collections.Games.find({
            date: game.date
        }).fetch();
        return games;
    },
    calendarDataReady: function(){
        return Session.get('calendarDataReady');
    },
    canBeClosed: function(){
        var game = new Bolt.Game( Session.get( 'game' ) );
        var userSelections = Session.get( 'userSelections' );
        var nbPlayers = userSelections.nbPlayers;
        return game.canBeClosed( nbPlayers );
    },
    canBeBooked: function( gameData ){
        var game = new Bolt.Game( gameData );
        var userSelections = Session.get( 'userSelections' );
        var nbPlayers = userSelections.nbPlayers;
        return game.canBeBooked( nbPlayers );
    },
    spotsLeftInGame: function( gameData ){
        var game = new Bolt.Game( gameData );
        return game.getNbAvailableSpots();
    },
    kamaainaPlayersOptions: function(){
        var kamaainaPlayersOptions = [];
        var userSelections = Session.get( 'userSelections' );
        var nbPlayers = userSelections.nbPlayers;
        // console.log( 'NBKAMAAINA',userSelections );
        for( var x = 0; x <= nbPlayers; x++ ){

            kamaainaPlayersOptions.push(x);

        }
        return kamaainaPlayersOptions;
    },
    hasSelectedNbPlayers: function(){
        var userSelections = Session.get( 'userSelections' );
        var nbPlayers = userSelections.nbPlayers;
        console.log( 'NBPLAYERS', nbPlayers );
        if( nbPlayers && nbPlayers !== "0" && nbPlayers !== 0 && nbPlayers !== "" ){
            return true;
        }else{
            return false;
        }
    },
    years: function(){
        var currentYear = new Date().getFullYear();
        var years = [];
        for( var x = currentYear; x < currentYear + 10; x++ ){
            years.push( x );
        }
        return years;
    }
});

Template.room2.events({

    'click [hook="set-time"]': function(evt,tmpl){
        evt.preventDefault();
        var userSelections = Session.get('userSelections');
        if( $(evt.currentTarget).hasClass('button-unavailable') && userSelections.nbPlayers ){
            Notifications.error('Too many players.','There are not enough spots left for the number of players you selected.');
        }else {
            userSelections.time = $(evt.currentTarget).attr('hook-data');
            Session.set('userSelections',userSelections);
            // console.log(userSelections.time);
        }

    },
    'change [hook="update-players"]': function( evt, tmpl ){

        var room = tmpl.data.room;

        var formData = Bureaucrat.getFormData( $( '[hook="reservation-form"]' ) );
        if( formData.nbKamaaina && formData.nbPlayers < formData.nbKamaaina ){
            formData.nbKamaaina = formData.nbPlayers;
        }

        if( !formData.nbPlayers ){
            formData.nbPlayers = 0;
        }
        if( formData.nbPlayers == room.maxPlayers || formData.nbPlayers == room.maxPlayers-1 ){
            formData.closeRoom = false;
        }

        tmpl.updateReservation(formData);

    },
    'change [hook="update-reservation"]': function( evt, tmpl ){
        tmpl.updateReservation();
    },
    'keyup [hook="update-coupon"]': function( evt, tmpl ){

        var formData = Bureaucrat.getFormData( $( '[hook="reservation-form"]' ) );
        if( !formData.coupon ){
            formData.coupon = false;
            formData.discount = 0;
        }
        tmpl.updateReservation( formData );

    },
    'submit form': function(evt,tmpl){

        evt.preventDefault();
        tmpl.submitOrder();

    },
    'click [hook="checkout"]': function(evt,tmpl){

        evt.preventDefault();
        tmpl.submitOrder();

    }
});