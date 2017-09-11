/**
 * =============================================================
 * DATA CONTEXT
 * Template data: room, settings
 * Router subscriptions: room
 * Template subscriptions: games
 * =============================================================
 */

/**
 * =============================================================
 * TEMPLATE CREATED
 * =============================================================
 */
Template.room.onCreated(function(){

    // SUBSCRIBE TO GAMES
    // USED TO CALCULATE SUCCESS RATE
    // ? ALSO USED TO DISPLAY SELECTED DAY GAMES
    Meteor.subscribe( 'games' );

    // UI UPDATE HANDLER
    this.updateReservation = function( formData ){

        // GET FORM DATA
        var formData = formData || Bureaucrat.getFormData( $( '[hook="reservation-form"]' ) );

        // GET USER SELECTIONS
        var userSelections = Session.get( 'userSelections' ) || {};

        // FORMAT COUPON
        if( formData.coupon ) {
            formData.coupon = formData.coupon.toUpperCase();
        }

        // SET USER SELECTIONS
        // TEMPLATE SHOULD UPDATE REACTIVELY
        Session.set( 'userSelections', _.extend( userSelections, formData ) );

    }

    // FORM HANDLER
    this.submitOrder = function(){

        // SHOW LOADING GIF
        Bolt.showLoadingAnimation();

        // GET FORM DATA
        var formData = Bureaucrat.getFormData( $( '[hook="reservation-form"]' ) );

        // GET USER SELECTIONS
        var userSelections = Session.get( 'userSelections' );

        // FORMAT COUPON
        if( formData.coupon ) {
            formData.coupon = formData.coupon.toUpperCase();
        }

        // GET ROOM DATA
        var room = this.data.room;

        // COMBINE ALL AVAILABLE DATA BEFORE CREATING RESERVATION OBJECT
        var reservationData = _.extend( userSelections, formData );
        var reservation = new Bolt.Reservation(_.extend( reservationData, {roomId: room._id, room:room } ));

        // IF RESERVATION DATA IS OK
        if( reservation.isValid() ) {

            // GRAB GAME DATA
            var game = new Bolt.Game(Session.get('game'));

            // SCENARIO 1: FREE GAME OR PAY-AT-CHECKIN GAME
            if( reservation.total == 0 || reservation.pay == 'check-in' ) {

                // ADD RESERVATION TO GAME
                var resId = game.addReservation(reservation);

                // SAVE GAME
                var orderProcessed = game.save();

                // IF GAME WAS SAVED SUCCESSFULLY
                if (orderProcessed) {

                    // FB EVENT TRACKING
                    var fbe = {
                        value: reservation.total,
                        currency: 'USD'
                    }
                    console.log( 'FB EVENT DATA', fbe );
                    fbq(
                        'track',
                        'Purchase',
                        {
                            value: fbe.value,
                            currency: 'USD'
                        }
                    );

                    // GA EVENT TRACKING
                    var gae = {
                        event: 'event',
                        category: 'Transaction',
                        action: "Reservation " + "(pay: "+reservation.pay+")",
                        label: "Reservation - " + reservation.room.title,
                        total: reservation.total,
                        couponValue: reservation.subtotal,
                        transactionId: resId,
                        deliveryFee: "0",
                        taxes: reservation.taxes,
                        itemName: room.title,
                        sku: room.slug,
                        price: reservation.subtotal

                    };
                    console.log( 'GA EVENT DATA', gae );
                    ga( 'send', gae.event, gae.category, gae.action, gae.label, parseInt( reservation.subtotal ) );

                    ga('ecommerce:addTransaction', {
                        'id': gae.transactionId,                     // Transaction ID. Required.
                        'revenue': gae.total,               // Grand Total.
                        'shipping': gae.deliveryFee,                  // Shipping.
                        'tax': gae.taxes                    // Tax.
                    });
                    ga('ecommerce:addItem', {
                        'id': gae.transactionId,                     // Transaction ID. Required.
                        'name': gae.itemName,    // Product name. Required.
                        'sku': gae.sku,                 // SKU/code.
                        'category': 'Reservation',         // Category or variation.
                        'price': gae.price,                 // Unit price.
                        'quantity': '1'                   // Quantity.
                    });
                    ga('ecommerce:send');

                    // GA EVENT TRACKING
                    // analytics.track(
                    //     "Reservation",
                    //     {
                    //         category: "Transaction",
                    //         revenue: reservation.total,
                    //         label: "Reservation - " + reservation.room.title
                    //     }
                    // );

                    // SEND EMAILS
                    reservation.sendConfirmationEmail();
                    reservation.sendNotificationEmail();

                    // SEND SMS
                    reservation.sendNotificationSMS( game, reservation.total + ' due at check-in' );

                    // HIDE LOADING GIF
                    Bolt.hideLoadingAnimation();

                    // GO TO CONFIRMATION
                    Router.go('confirmation', {_id: resId});

                }

            // SCENARIO 2: PAYMENT REQUIRED
            }else {

                // START STRIPE TRANSACTION: GET TOKEN
                Stripe.card.createToken({
                    number: reservation.cc,
                    exp_month: reservation.ccExpMonth,
                    exp_year: reservation.ccExpYear,
                    cvc: reservation.cvv,

                // TOKEN CALLBACK
                }, function (status, response) {

                    // IF STATUS IS OK
                    if( status == 200 ) {

                        // GET TOKEN
                        var stripeToken = response.id;

                        // CHARGE CARD
                        Meteor.call(
                            'chargeCard',                       // METEOR METHOD
                            stripeToken,                        // TOKEN
                            parseInt(reservation.total * 100),  // AMOUNT IN CENTS
                            reservation.email,                  // BUYER EMAIL
                            function (error, response) {        // CALLBACK

                                // ERROR HANDLER
                                if (error) {

                                    // METEOR ERROR
                                    throw new Meteor.Error('|Bolt|chargeCard|Error', error.message);

                                    // UI ERROR FOR USER
                                    Notifications.error(error.message);

                                    // HIDE LOADING GIF
                                    Bolt.hideLoadingAnimation();

                                // SUCCESSFUL TRANSACTION HANDLER
                                } else {

                                    // ADD RESERVATION TO GAME
                                    var resId = game.addReservation(reservation);

                                    // ADD TRANSACTION GAME/RES DATA
                                    game.addTransaction({
                                        reservationPublicId: resId,
                                        amount: reservation.total,
                                        ccTransaction: response
                                    });

                                    // SAVE GAME
                                    var orderProcessed = game.save();

                                    // IF GAME WAS SAVED OK
                                    if (orderProcessed) {

                                        // FB EVENT TRACKING
                                        var fbe = {
                                            value: reservation.total,
                                            currency: 'USD'
                                        }
                                        console.log( 'FB EVENT DATA', fbe );
                                        fbq(
                                            'track',
                                            'Purchase',
                                            {
                                                value: fbe.value,
                                                currency: 'USD'
                                            }
                                        );

                                        // GA EVENT TRACKING
                                        var gae = {
                                            event: 'event',
                                            category: 'Transaction',
                                            action: "Reservation " + "(pay: "+reservation.pay+")",
                                            label: "Reservation - " + reservation.room.title,
                                            total: reservation.total,
                                            couponValue: reservation.subtotal,
                                            transactionId: resId,
                                            deliveryFee: "0",
                                            taxes: reservation.taxes,
                                            itemName: room.title,
                                            sku: room.slug,
                                            price: reservation.subtotal

                                        };
                                        console.log( 'GA EVENT DATA', gae );
                                        ga( 'send', gae.event, gae.category, gae.action, gae.label, parseInt( reservation.subtotal ) );

                                        ga('ecommerce:addTransaction', {
                                            'id': gae.transactionId,                     // Transaction ID. Required.
                                            'revenue': gae.total,               // Grand Total.
                                            'shipping': gae.deliveryFee,                  // Shipping.
                                            'tax': gae.taxes                    // Tax.
                                        });
                                        ga('ecommerce:addItem', {
                                            'id': gae.transactionId,                     // Transaction ID. Required.
                                            'name': gae.itemName,    // Product name. Required.
                                            'sku': gae.sku,                 // SKU/code.
                                            'category': 'Reservation',         // Category or variation.
                                            'price': gae.price,                 // Unit price.
                                            'quantity': '1'                   // Quantity.
                                        });
                                        ga('ecommerce:send');

                                        // GA EVENT TRACKING
                                        // analytics.track(
                                        //     "Reservation",
                                        //     {
                                        //         category: "Transaction",
                                        //         revenue: reservation.total,
                                        //         label: "Reservation - " + reservation.room.title
                                        //     }
                                        // );

                                        // SEND EMAILS
                                        reservation.sendConfirmationEmail();
                                        reservation.sendNotificationEmail();

                                        //SEND SMS
                                        reservation.sendNotificationSMS( game, 'paid online' );

                                        // HIDE LOADING GIF
                                        Bolt.hideLoadingAnimation();

                                        // GO TO CONFIRMATION PAGE
                                        Router.go('confirmation', {_id: resId});

                                    } else {

                                        Bolt.hideLoadingAnimation();
                                        Notifications.error('Payment succeeded but there was an issue saving the reservation to our system. Please call us.')

                                    }
                                }
                            }
                        );

                    }else{

                        Notification.error('Payment processing error');
                        // console.log( 'Stripe status not 200', status, response );
                        Bolt.hideLoadingAnimation();
                    }

                });

            }

        }else{
            // // console.log( 'Reservation not valid' );
            Bolt.hideLoadingAnimation();
        }

    }
});


/**
 * =============================================================
 * TEMPLATE RENDERED
 * =============================================================
 */
Template.room.onRendered(function(){

    // Subscribe to coupons
    Meteor.subscribe( 'coupons' );

    // Grab room info
    var room = this.data.room;

    // LOG ROOM DETAILS VIEW
    fbq('track', 'ViewContent', {
        content_ids: room.slug,
        product: 'room'
    });

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

    // // console.log( "JUST SET userSelections in onRendered", Session.get( 'userSelections' ) );

    // Set game data
    //// console.log( 'room autorun', room, date, time );
    // console.log('!');
    var game = new Bolt.Game({
        roomId: room._id,
        date: date,
        time: time
    });
    //// console.log( 'SETTING GAME IN SESSION', game );
    Session.set( 'game', game );

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
        // console.log('?');
        var game = new Bolt.Game({
            roomId: room._id,
            date: date,
            time: time
        });
        Session.set( 'game', game );


        // Grab games for newly selected date
        // // console.log('AUTORUN: Fetching game data');
        // var tstamp1 = new Date().getTime();
        // Session.set('calendarDataReady', false);
        // Meteor.call('fetchGames', date, room._id, function(error,response){
        //     var tstamp2 = new Date().getTime();
        //     // console.log('AUTORUN: Game data ready in ' + ( tstamp2 - tstamp1 ) + 'ms');
        //     if( error ){
        //         // console.log( 'error fetching games' );
        //         Session.set('calendarDataReady', true);
        //     }else{
        //         Session.set('games',response);
        //         Session.set('calendarDataReady', true);
        //     }
        // });
        // var tstamp1 = new Date().getTime();
        // Meteor.subscribe(
        //     'games',
        //     game.date,
        //     {
        //         onReady: function () {
        //             var tstamp2 = new Date().getTime();
        //             // console.log('AUTORUN: Game data ready in ' + ( tstamp2 - tstamp1 ) + 'ms');
        //
        //             Session.set('calendarDataReady', true);
        //         },
        //         onStop: function () {
        //             // console.log('error in games subscription');
        //         }
        //     }
        // );




    });
});


/**
 * =============================================================
 * TEMPLATE DESTROYED
 * =============================================================
 */
Template.room.onDestroyed(function(){});

/**
 * =============================================================
 * TEMPLATE EVENTS
 * =============================================================
 */
Template.room.events({
    'click [hook="set-time"]': function(evt,tmpl){
        evt.preventDefault();
        var userSelections = Session.get('userSelections');
        if( $(evt.currentTarget).hasClass('button-unavailable') && userSelections.nbPlayers ){
            Notifications.error('Too many players.','There are not enough spots left for the number of players you selected.');
        }else {
            userSelections.time = $(evt.currentTarget).attr('hook-data');
            Session.set('userSelections',userSelections);
            // // console.log(userSelections.time);
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


/**
 * =============================================================
 * TEMPLATE HELPERS
 * =============================================================
 */
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
        if( Session.get('game') ) {
            var game = new Bolt.Game(Session.get('game'));
            var games = Bolt.Collections.Games.find({
                date: game.date,
                $or: [
                    {roomId: game.roomId},
                    {roomId: 'any'}
                ]
            }, {
                sort: {time: 1}
            }).fetch();
            // console.log('GAMES? ', games);
            return games;
        }
        // if( Session.get('calendarDataReady') ) {
        //     var roomId = this.room._id;
        //     var game = new Bolt.Game(Session.get('game'));
        //     var games = Bolt.Collections.Games.find({
        //         date: game.date,
        //         $or: [
        //             {roomId: roomId},
        //             {roomId: 'any'}
        //         ]
        //     }, {
        //         sort: {time: 1}
        //     }).fetch();
        //
        //     _.each(games, function (game) {
        //         if (game.roomId == 'any') {
        //             game.roomId = roomId;
        //         }
        //     });
        //     return games;
        // }else{
        //     return [];
        // }
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
        // // console.log( 'GAME DATA', gameData );
        var game = new Bolt.Game( gameData );
        var userSelections = Session.get( 'userSelections' );
        var nbPlayers = userSelections.nbPlayers;
        // // console.log( game, nbPlayers );
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
        // // console.log( 'NBKAMAAINA',userSelections );
        for( var x = 0; x <= nbPlayers; x++ ){

            kamaainaPlayersOptions.push(x);

        }
        return kamaainaPlayersOptions;
    },
    hasSelectedNbPlayers: function(){
        var userSelections = Session.get( 'userSelections' );
        var nbPlayers = userSelections.nbPlayers;
        // // console.log( 'NBPLAYERS', nbPlayers );
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
        // // console.log( 'in isFree', this.room );

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
        var tmpl = this;

        Bolt.getSuccessRates();

        var successRates = Session.get('successRates');

        if( successRates ){
            return successRates[tmpl.room._id].successRate;
        }else {
            return false;
        }
    }
});

