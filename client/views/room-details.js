Template.room.onCreated(function(){
    Meteor.subscribe( 'games' );
    this.updateReservation = function( formData ){

        var formData = formData || Bureaucrat.getFormData( $( '[hook="reservation-form"]' ) );
        var userSelections = Session.get( 'userSelections' ) || {};

        if( formData.coupon ) {
            formData.coupon = formData.coupon.toUpperCase();
        }

        //ok

        Session.set( 'userSelections', _.extend( userSelections, formData ) );
        // console.log( "JUST SET userSelections in onCreated", Session.get( 'userSelections' ) );
    }
    this.submitOrder = function(){

        Bolt.showLoadingAnimation();


        var formData = Bureaucrat.getFormData( $( '[hook="reservation-form"]' ) );
        var userSelections = Session.get( 'userSelections' );
        if( formData.coupon ) {
            formData.coupon = formData.coupon.toUpperCase();
        }
        // console.log('THIS SHOULD NOT WORK',formData);
        var room = this.data.room;
        var reservationData = _.extend( userSelections, formData );
        var reservation = new Bolt.Reservation(_.extend( reservationData, {roomId: room._id, room:room } ));

        if( reservation.isValid() ) {


            // Grab room info
            var game = new Bolt.Game(Session.get('game'));
            // console.log('insert game id here?');
            // if(!game._id){
            //     gameWithId = new Bolt.Game({});
            // }
            //game.addReservation( reservation );

            // console.log('SUBMIT ORDER', reservation, game);



            if( reservation.total == 0 || reservation.pay == 'check-in' ) {

                var resId = game.addReservation(reservation);

                // console.log('Just before saving game', game);
                // Save game
                var orderProcessed = game.save();

                if (orderProcessed) {

                    fbq('track', 'Purchase', {
                        value: reservation.total,
                        currency: 'USD'
                    });

                    analytics.track("New Reservation", {
                        eventName: reservation.room.title,
                        couponValue: reservation.total,
                    });


                    reservation.sendConfirmationEmail();
                    reservation.sendNotificationEmail();

                    //Configure the Twilio client
                    var SMSString = "New Booking - " +
                        reservation.room.title +
                        " - " +
                        game.date +
                        " @ " +
                        game.time +
                        " - " +
                        reservation.nbPlayers + " players" +
                        " - " +
                        "$" + reservation.total;
                    Meteor.call('sendAdminNotificationSMS', SMSString, function (error, response) {
                        if (error) {
                            // //console.log( error );
                            new Meteor.Error("[roomDetails][submitOrder][sendSMS] Error", error.message);
                        } else {
                            // //console.log( response );
                        }

                    });


                    Bolt.hideLoadingAnimation();
                    Router.go('confirmation', {_id: resId});

                }

            }else {


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
                        parseInt( reservation.total * 100 ),
                        reservation.email,
                        function (error, response) {
                            if (error) {

                                throw new Meteor.Error('|Bolt|chargeCard|Error', error.message);
                                Notifications.error( error.message );
                                Bolt.hideLoadingAnimation();

                            } else {

                                var resId = game.addReservation(reservation);
                                game.addTransaction({
                                    reservationPublicId: resId,
                                    amount: reservation.total,
                                    ccTransaction: response
                                });

                                // Save game
                                var orderProcessed = game.save();

                                if (orderProcessed) {

                                    fbq('track', 'Purchase', {
                                        value: reservation.total,
                                        currency: 'USD'
                                    });

                                    analytics.track("New Reservation", {
                                        eventName: reservation.room.title,
                                        couponValue: reservation.total,
                                    });

                                    reservation.sendConfirmationEmail();
                                    reservation.sendNotificationEmail();

                                    //Configure the Twilio client
                                    var SMSString = "New Booking - " +
                                        reservation.room.title +
                                        " - " +
                                        game.date +
                                        " @ " +
                                        game.time +
                                        " - " +
                                        reservation.nbPlayers + " players" +
                                        " - " +
                                        "$" + reservation.total;
                                    Meteor.call('sendAdminNotificationSMS', SMSString, function (error, response) {
                                        if (error) {
                                            // //console.log( error );
                                            new Meteor.Error("[roomDetails][submitOrder][sendSMS] Error", error.message);
                                        } else {
                                            // //console.log( response );
                                        }

                                    });


                                    Bolt.hideLoadingAnimation();
                                    Router.go('confirmation', {_id: resId});

                                }else{

                                    Bolt.hideLoadingAnimation();
                                    Notifications.error( 'Payment succeeded but there was an issue saving the reservation to our system. Please call us.')

                                }
                            }
                        }
                    );

                });

            }

        }else{
            // console.log( 'Reservation not valid' );
            Bolt.hideLoadingAnimation();
        }

    }
});

Template.room.onRendered(function(){

    fbq('track', 'ViewContent');

    // Subscribe to coupons
    Meteor.subscribe( 'coupons' );

    // Grab room info
    var room = this.data.room;

    this.autorun( function(){

        // Grab user selections
        var userSelections = Session.get( 'userSelections' ) || {};

        var date = userSelections.date || Epoch.today();
        var time = userSelections.time;
        var roomId = userSelections.roomId;
        if( roomId != room._id ){
            userSelections.time = false;
            userSelections.roomId = room._id;
        }

        Session.set( 'userSelections', userSelections );
        // console.log( "JUST SET userSelections in onRendered", Session.get( 'userSelections' ) );

        // Set game data
        //console.log( 'room autorun', room, date, time );
        var game = new Bolt.Game({
            roomId: room._id,
            date: date,
            time: time
        });
        //console.log( 'SETTING GAME IN SESSION', game );
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


        var minDate = Epoch.today();
        if( room.openingDate > minDate ){
            minDate = room.openingDate;
            var us = Session.get('userSelections');
            if( !us.date || us.date < minDate ) {
                us.date = minDate;
                Session.set('userSelections',us);
            }
        }

        $('#datepicker').datepicker({
            minDate: minDate,
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

Template.room.helpers({
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
        var roomId = this.room._id;
        var game = new Bolt.Game( Session.get( 'game' ) );
        var games = Bolt.Collections.Games.find({
            date: game.date,
            $or: [
                {roomId: roomId},
                {roomId: 'any'}
            ]
        },{
            sort: {time:1}
        }).fetch();

        _.each(games,function(game){
            if( game.roomId == 'any' ){
                game.roomId = roomId;
            }
        });
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
        // console.log( 'GAME DATA', gameData );
        var game = new Bolt.Game( gameData );
        var userSelections = Session.get( 'userSelections' );
        var nbPlayers = userSelections.nbPlayers;
        // console.log( game, nbPlayers );
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
        // console.log( 'NBPLAYERS', nbPlayers );
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
    },
    isFree: function(){
        // console.log( 'in isFree', this.room );

        var formData = Bureaucrat.getFormData( $( '[hook="reservation-form"]' ) );
        var userSelections = Session.get( 'userSelections' );
        if( formData.coupon ) {
            formData.coupon = formData.coupon.toUpperCase();
        }

        var room = this.room;
        var reservationData = _.extend( userSelections, formData );
        var reservation = new Bolt.Reservation(_.extend( reservationData, {roomId: room._id, room:room } ));

        // var room = this.room;
        // var reservation = new Bolt.Reservation( _.extend( reservationData, {roomId: room._id, room:room } ) );
        return reservation.total == 0 ? true : false;
    },
    dynamicSuccessRate: function(){
        var games = Bolt.Collections.Games.find( { roomId: this.room._id } ).fetch();
        var nbGames = 0;
        var nbGamesWon = 0;
        _.each( games, function( game ) {
            if (game && game.won === true || game.won === false) {
                nbGames++;
                if (game.won) {
                    nbGamesWon++;
                }
            }
        });
        if( nbGames < 10 ) {
            return this.room.successRate;
        }else{
            return Math.ceil(nbGamesWon / nbGames * 100);
        }
    }

});

Template.room.events({

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
    'submit [hook="reservation-form"]': function(evt,tmpl){

        evt.preventDefault();
        tmpl.submitOrder();

    },
    'click [hook="checkout"]': function(evt,tmpl){

        evt.preventDefault();
        tmpl.submitOrder();

    }
});

// Template.room.onCreated(function(){
//
//
//     this.updateReservation = function( formData ){
//
//         var formData = formData || Bureaucrat.getFormData( $( '[hook="reservation-form"]' ) );
//         var reservation = new Bolt.Reservation( Session.get('reservation') );
//         if( formData.coupon ) {
//             formData.coupon = formData.coupon.toUpperCase();
//         }
//         reservation.populate( formData );
//         Session.set( 'reservation',reservation );
//     }
//
//     this.submitOrder = function(){
//
//
//         var reservation = new Bolt.Reservation( Session.get( 'reservation' ) );
//
//         if( reservation.isValid() ){
//
//             // analytics.track("Booking", {
//             //     name: reservation.room.title + ' Booking',
//             //     revenue: reservation.total
//             // });
//
//             $('.processing-bg').show()
//
//             if( reservation.total == 0 ){
//
//                 var lastRes = Bolt.Collections.Reservations.findOne({}, {sort: {publicId: -1}});
//
//                 if (lastRes && lastRes.publicId) {
//                     reservation.publicId = lastRes.publicId + 1;
//                 } else {
//                     reservation.publicId = 350000;
//                 }
//
//                 reservation.transaction = {
//                     amount: 0
//                 }
//
//                 var resId;
//                 if( reservation.date <= "2017-01-11" ){
//                     resId = reservation.save();
//                 }else{
//                     console.log('WTF?',{date:reservation.date,time:reservation.validationModelTime});
//                     var gameData = Bolt.Collections.Games.findOne({date:reservation.date,time:reservation.validationModelTime});
//                     var game = new Bolt.Game(gameData);
//                     if( !game.reservations ){
//                         game.reservations = [];
//                     }
//                     game.reservations.push( reservation );
//                     resId = game.save();
//                 }
//
//
//                 if( resId ){
//
//                     if ( reservation.coupon && reservation.couponData ){
//
//                         Bolt.Collections.Coupons.update(
//                             {
//                                 _id: reservation.couponData._id
//                             },
//                             {
//                                 $inc: {
//                                     uses: 1
//                                 }
//                             }
//                         );
//                     }
//
//                     reservation.sendConfirmationEmail();
//                     reservation.sendNotificationEmail();
//
//                     // Configure the Twilio client
//                     var SMSString = "New Booking - " +
//                         reservation.room.title +
//                         " - " +
//                         reservation.date +
//                         " @ " +
//                         reservation.time +
//                         " - " +
//                         reservation.nbPlayers + " players" +
//                         " - " +
//                         "$0.00";
//                     Meteor.call('sendAdminNotificationSMS', SMSString, function(error,response){
//                         if( error ) {
//                             // //console.log( error );
//                             new Meteor.Error("[roomDetails][submitOrder][sendSMS] Error", error.message);
//                         }else{
//                             // //console.log( response );
//                         }
//
//                     });
//
//
//                     $('.processing-bg').hide();
//                     Router.go('confirmation', {_id:resId});
//
//                 }
//
//             }else {
//
//                 Stripe.card.createToken({
//                     number: reservation.cc,
//                     exp_month: reservation.ccExpMonth,
//                     exp_year: reservation.ccExpYear,
//                     cvc: reservation.cvv,
//                 }, function (status, response) {
//
//                     var stripeToken = response.id;
//
//                     Meteor.call('chargeCard', stripeToken, parseInt( reservation.total * 100 ), function (error, result) {
//
//                         if (error) {
//
//                             $('.processing-bg').hide();
//                             Notifications.error(error.message, 'Sorry. We could not process your card. Please call 808.635.6957');
//
//                         } else if (result) {
//
//                             var lastRes = Bolt.Collections.Reservations.findOne({}, {sort: {publicId: -1}});
//
//                             if (lastRes && lastRes.publicId) {
//                                 reservation.publicId = lastRes.publicId + 1;
//                             } else {
//                                 reservation.publicId = 350000
//                             }
//
//                             reservation.transaction = result;
//
//                             var resId = reservation.save()
//
//                             if ( resId ) {
//
//                                 if ( reservation.coupon && reservation.couponData ){
//
//                                     Bolt.Collections.Coupons.update(
//                                         {
//                                             _id: reservation.couponData._id
//                                         },
//                                         {
//                                             $inc: {
//                                                 uses: 1
//                                             }
//                                         }
//                                     );
//                                 }
//
//                                 // Track conversion
//                                 // analytics.track("Completed Order", {
//                                 //     eventName: reservation.room.title,
//                                 //     couponValue: reservation.total,
//                                 // });
//                                 var discount = parseFloat( reservation.discount ) + parseFloat( reservation.discountKamaaina );
//                                 var revenue = parseFloat( reservation.subtotal - discount ).toFixed(2);
//                                 var coupon = reservation.couponData && reservation.couponData.coupon ? reservation.couponData.coupon : "";
//                                 var room = Bolt.Collections.Rooms.findOne(reservation.roomId);
//                                 var products = [
//                                     {
//                                         product_id: reservation.roomId,
//                                         sku: 'KER-'+reservation.roomId,
//                                         name: room.title,
//                                         price: room.pricePerPlayer,
//                                         quantity: reservation.nbPlayers,
//                                         category: 'Escape Room'
//                                     }
//                                 ];
//                                 if( reservation.closeRoom ){
//                                     products.push({
//                                         product_id: 'CLOSEDROOMFEE',
//                                         sku: 'KER-CLOSEDROOMFEE',
//                                         name: 'Closed Room Fee',
//                                         price: room.priceToClose,
//                                         quantity: 1,
//                                         category: 'Escape Room'
//                                     });
//                                 }
//                                 var trackRes = analytics.track("Order Completed", {
//                                     checkout_id: reservation.publicId,
//                                     order_id: reservation._id,
//                                     affiliation: 'Kauai Escape Room',
//                                     total: reservation.total,
//                                     revenue: revenue,
//                                     shipping: 0,
//                                     tax: reservation.taxes,
//                                     discount: discount,
//                                     coupon: coupon,
//                                     currency: 'USD',
//                                     products: products
//                                 });
//
//                                 reservation.sendConfirmationEmail();
//                                 reservation.sendNotificationEmail();
//
//                                 // Configure the Twilio client
//                                 var SMSString = "New Booking - " +
//                                     reservation.room.title +
//                                     " - " +
//                                     reservation.date +
//                                     " @ " +
//                                     reservation.time +
//                                     " - " +
//                                     reservation.nbPlayers + " players" +
//                                     " - " +
//                                     "$" + reservation.total;
//                                 Meteor.call('sendAdminNotificationSMS', SMSString, function(error,response){
//                                     if( error ) {
//                                         // //console.log( error );
//                                         new Meteor.Error("[roomDetails][submitOrder][sendSMS] Error", error.message);
//                                     }else{
//                                         // //console.log( response );
//                                     }
//
//                                 });
//
//                                 $('.processing-bg').hide();
//                                 // //console.log( 'track res', trackRes, {
//                                 //     checkout_id: reservation.publicId,
//                                 //     order_id: reservation._id,
//                                 //     affiliation: 'Kauai Escape Room',
//                                 //     total: reservation.total,
//                                 //     revenue: revenue,
//                                 //     shipping: 0,
//                                 //     tax: reservation.taxes,
//                                 //     discount: discount,
//                                 //     coupon: coupon,
//                                 //     currency: 'USD',
//                                 //     products: products
//                                 // } )
//                                 Router.go('confirmation', {_id:resId});
//
//                             } else {
//                                 Notifications.error('Charge OK but Reservation failed', 'Please call 808.635.6957');
//                             }
//                         } else {
//                             Notifications.error('Payment Processing Error', 'Sorry. We could not process your card. Please call 808.635.6957');
//                         }
//                     });
//
//                 });
//             }
//
//         }
//
//     }
// });
// Template.room.onRendered(function(){
//
//     Session.set('calendarReservationsReady',false);
//     Session.set('calendarGamesReady',false);
//
//
//
//     Meteor.subscribe( 'coupons' );
//     Meteor.subscribe( 'reservationNumbers' );
//
//
//
//     // var date = window.location.pathname.substring(window.location.pathname.length -10, window.location.pathname.length );
//     //
//     //
//
//
//
//     var self = this;
//     var r = new Bolt.Reservation( Session.get('reservation') || {room: this.data, date:Epoch.dateObjectToDateString(new Date())} );
//     r.time = "";
//     Session.set('reservation',r);
//
//     this.autorun(function() {
//
//         //console.log( 'STARTING AUTORUN FOR NEW SUBS' );
//         // var date = Session.get('roomCalendarDay');
//         var reservation = new Bolt.Reservation( Session.get('reservation') || {room: this.data, date:Epoch.dateObjectToDateString(new Date())} );
//         var date;
//         if( reservation && reservation.date ){
//             date = reservation.date;
//         }else{
//             date = Epoch.dateObjectToDateString(new Date());
//         }
//
//         Meteor.subscribe(
//             'reservations',
//             date,
//             {
//                 onReady: function () {
//                     //console.log('reservations ready');
//                     Session.set('calendarReservationsReady', true);
//                 },
//                 onError: function(){
//                     //console.log('error in reservations subscription');
//                 }
//             }
//         );
//         Meteor.subscribe(
//             'games',
//             date,
//             {
//                 onReady: function () {
//                     //console.log('games ready');
//                     Session.set('calendarGamesReady', true);
//                 },
//                 onError: function(){
//                     //console.log('error in games subscription');
//                 }
//             }
//         );
//
//         // // hack to force the autorun to reevaluate
//         // Template.currentData();
//
//         //var reservation = new Bolt.Reservation( Session.get('reservation') || {room: this.data, date:Epoch.dateObjectToDateString(new Date())} );
//
//         // check that time is in startTimes array
//         if( _.indexOf(self.data.startTimes, reservation.time) === -1 ){
//             delete reservation.time;
//         }
//
//         reservation.roomId = self.data._id;
//         reservation.room = self.data;
//         Meteor.subscribe( 'pastGameResults', reservation.room.slug );
//
//         var minDate = Epoch.dateObjectToDateString(new Date());
//
//
//         // Make sure dates are only available on the calendar after game is open to the public
//         if( reservation.room && reservation.room.openingDate && reservation.room.openingDate > minDate ){
//             minDate = reservation.room.openingDate;
//         }
//         if( reservation.date < reservation.room.openingDate ){
//             reservation.date = reservation.room.openingDate;
//         }
//
//
//         // Make sure dates are only available on the calendar before game is closed to the public
//
//         var closingDate = Epoch.addDaysToDate( 365, Epoch.dateObjectToDateString(new Date()) );
//         // var closingDate = defaultClosingDate );
//         // if( reservation.room._id == "PFkTRYQ8kqfJzZRmP" ){
//         //     closingDate = '2017-01-10';
//         // }
//         if( reservation.room && reservation.room.closingDate ){
//             closingDate = reservation.room.closingDate;
//         }
//         console.log( 'Closing Date:', closingDate );
//
//         $('#datepicker').datepicker({
//             minDate: minDate,
//             maxDate: closingDate,
//             dateFormat: 'yy-mm-dd',
//             defaultDate: reservation.date,
//             onSelect: function (dateText, inst) {
//                 $('.ui-state-highlight').removeClass("ui-state-highlight");
//                 var formData = Bureaucrat.getFormData($('[hook="reservation-form"]'));
//                 if (formData) {
//                     reservation.populate(formData);
//                 }
//                 reservation.date = dateText;
//                 reservation.time = false;
//                 Session.set('calendarReservationsReady',false);
//                 Session.set('calendarGamesReady',false);
//                 Session.set('reservation', reservation);
//                 // Router.go('roomByDate',{slug:reservation.room.slug,date:dateText});
//                 //Router.go('/room/'+reservation.room.slug+'/'+dateText+'#booknow');
//                 // //console.log('Route change?');
//             }
//         });
//
//         // Make sure we don't carry time when switching rooms, pages
//         if( reservation ){
//             if( Session.get('selectedTimeFromCalendar') ){
//                 var t = Session.get('selectedTimeFromCalendar');
//                 reservation.time = t;
//                 Session.set('selectedTimeFromCalendar',false);
//             }
//         }
//
//         Session.set( 'reservation', reservation );
//
//
//     });
//
//
// });
//
// Template.room.helpers({
//
//     years: function(){
//         var currentYear = new Date().getFullYear();
//         var years = [];
//         for( var x = currentYear; x < currentYear + 10; x++ ){
//             years.push( x );
//         }
//         return years;
//     },
//
//     reservation: function(){
//         console.log( 'Running reservation helper' );
//         return Session.get( 'reservation' );
//     },
//
//     // hasEnoughSpots: function(reservation){
//     //     var spotsLeft = Bolt.spotsLeft(reservation.roomId, reservation.date, reservation.time);
//     //     return spotsLeft >= reservation.nbPlayers ? true : false;
//     // },
//     isFree: function(){
//         var reservation = new Bolt.Reservation( Session.get('reservation') );
//         return reservation.total == 0 ? true : false;
//     },
//     nbPlayersOptions: function(  ){
//         var nbPlayersOptions = [];
//         var spotsLeft;
//         var reservation = Session.get('reservation');
//         if( reservation.date && reservation.time ){
//             spotsLeft = Bolt.spotsLeft( reservation.room._id, reservation.date, reservation.time );
//         }else{
//             spotsLeft = reservation.room.maxPlayers;
//         }
//         if( this ){
//             for( var x = reservation.room.minPlayers; x <= reservation.room.maxPlayers; x++ ){
//                 if( x <= spotsLeft ) {
//                     nbPlayersOptions.push(x);
//                 }
//             }
//         }
//         // ////console.log('nbPlayersOptions', this, nbPlayersOptions);
//         return nbPlayersOptions;
//     },
//     kamaainaPlayersOptions: function(){
//         var kamaainaPlayersOptions = [];
//         var reservation = Session.get('reservation');
//         //var spotsLeft = Bolt.spotsLeft( reservation.room._id, reservation.date, reservation.time );
//         //if( this ){
//         for( var x = 0; x <= reservation.nbPlayers; x++ ){
//
//             kamaainaPlayersOptions.push(x);
//
//         }
//         //}
//         return kamaainaPlayersOptions;
//     },
//     canClose: function(){
//         var reservation = new Bolt.Reservation(Session.get('reservation'));
//         return reservation.canClose();
//     },
//
//     startTimes: function(){
//         var reservation = Session.get('reservation');
//
//         if(
//             Session.get('calendarReservationsReady') == true &&
//             Session.get('calendarGamesReady') == true
//
//         ){
//             var day = Bolt.getAdminDay(reservation.date);
//             var startTimes = [];
//             _.each(day.times,function(t){
//                 //console.log(t);
//                 startTimes.push(t.time);
//             })
//             //console.log('NEW START TIMES',startTimes);
//             return startTimes;
//         }else{
//             //console.log('Subscriptions not ready');
//
//             return false
//         }
//     },
//     // day: function(){
//     //     var date = window.location.pathname.substring(window.location.pathname.length -10, window.location.pathname.length );
//     //
//     //     if(
//     //         Session.get('calendarReservationsReady') == true &&
//     //         Session.get('calendarGamesReady') == true
//     //
//     //     ){
//     //         var day = Bolt.getAdminDay(date);
//     //         var reservation = Session.get('reservation');
//     //         reservation.startTimes = [];
//     //         _.each(day.times,function(t){
//     //             //console.log(t);
//     //             reservation.startTimes.push(t.time);
//     //         })
//     //         //console.log('RESERVATION WITH NEW START TIMES',reservation);
//     //         Session.set('reservation',reservation);
//     //     }else{
//     //         //console.log('Subscriptions not ready');
//     //
//     //         return false
//     //     }
//     // },
//     dynamicSuccessRate: function(){
//         var games = Bolt.Collections.Games.find( { roomId: this._id } ).fetch();
//         var nbGames = 0;
//         var nbGamesWon = 0;
//         _.each( games, function( game ) {
//             if (game && game.won === true || game.won === false) {
//                 nbGames++;
//                 if (game.won) {
//                     nbGamesWon++;
//                 }
//             }
//         });
//         if( nbGames < 10 ) {
//             return this.successRate;
//         }else{
//             return Math.ceil(nbGamesWon / nbGames * 100);
//         }
//     },
//     settings: function () {
//         return Bolt.Collections.Settings.findOne({settingType: 'global'});
//     },
//     beforeInvalidationSwitch: function( date ){
//         console.log( 'IN NEW HELPER', date );
//         if( date <= '2017-01-11' ){
//             return true;
//         }else{
//             return false;
//         }
//     },
//     validationModelGames: function(){
//         var reservation = new Bolt.Reservation(Session.get('reservation'));
//         var games =  Bolt.Collections.Games.find({date:reservation.date});
//         console.log( 'GRABBING ALL VALIDATION MODEL GAMES FOR DATE', reservation.date, games.fetch() );
//         return games;
//     }
//
// });
//
// Template.room.events({
//
//     'change [hook="update-reservation"]': function( evt, tmpl ){
//
//         tmpl.updateReservation();
//
//     },
//     'change [hook="update-players"]': function( evt, tmpl ){
//
//         var formData = Bureaucrat.getFormData( $( '[hook="reservation-form"]' ) );
//         if( formData.nbKamaaina && formData.nbPlayers < formData.nbKamaaina ){
//             formData.nbKamaaina = formData.nbPlayers;
//         }
//         var reservation = new Bolt.Reservation( Session.get('reservation') );
//
//         if( !formData.nbPlayers ){
//             formData.nbPlayers = 0;
//         }
//         if( formData.nbPlayers == reservation.room.maxPlayers || formData.nbPlayers == reservation.room.maxPlayers-1 ){
//             formData.closeRoom = false;
//         }
//
//         tmpl.updateReservation(formData);
//
//     },
//     'keyup [hook="update-coupon"]': function( evt, tmpl ){
//
//         var formData = Bureaucrat.getFormData( $( '[hook="reservation-form"]' ) );
//         if( !formData.coupon ){
//             formData.coupon = false;
//             formData.discount = 0;
//         }
//         tmpl.updateReservation( formData );
//
//     },
//     'click [hook="set-time"]': function(evt,tmpl){
//         evt.preventDefault();
//         var reservation = new Bolt.Reservation( Session.get('reservation') );
//         if( $(evt.currentTarget).hasClass('button-unavailable') && reservation.nbPlayers ){
//             Notifications.error('Too many players.','There are not enough spots left for the number of players you selected.');
//         }else{
//             reservation.time = $(evt.currentTarget).attr('hook-data');
//             Session.set( 'reservation',reservation );
//         }
//         console.log('TIME SET?????', reservation);
//     },
//     'click [hook="set-validation-model-time"]': function(evt,tmpl){
//         evt.preventDefault();
//         var reservation = new Bolt.Reservation( Session.get('reservation') );
//         if( $(evt.currentTarget).hasClass('button-unavailable') && reservation.nbPlayers ){
//             Notifications.error('Too many players.','There are not enough spots left for the number of players you selected.');
//         }else{
//             reservation.validationModelTime = $(evt.currentTarget).attr('hook-data');
//             Session.set( 'reservation',reservation );
//         }
//         console.log('TIME SET?????', reservation);
//     },
//     // 'change [hook="nbPlayers"]': function(evt,tmpl){
//     //     var nbPlayers = $(evt.currentTarget).val();
//     //     if( nbPlayers == '0' ){
//     //         nbPlayers = false;
//     //     }else {
//     //         // check for discount adjustment
//     //         var selectedKamaaina = Session.get('selectedNbKamaaina');
//     //         if (selectedKamaaina && parseInt(selectedKamaaina) > parseInt(nbPlayers) ){
//     //             Session.set('selectedNbKamaaina', nbPlayers);
//     //         }
//     //     }
//     //     Session.set( 'selectedNbPlayers', nbPlayers );
//     // },
//
//     'submit form': function(evt,tmpl){
//
//         evt.preventDefault();
//         tmpl.submitOrder();
//
//     },
//     'click [hook="checkout"]': function(evt,tmpl){
//
//         evt.preventDefault();
//         tmpl.submitOrder();
//
//     }
// });