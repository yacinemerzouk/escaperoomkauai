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
    this.submitOrder = function() {

        // SHOW LOADING GIF
        Bolt.showLoadingAnimation();

        // GET FORM DATA
        var formData = Bureaucrat.getFormData($('[hook="reservation-form"]'));

        // GET USER SELECTIONS
        var userSelections = Session.get('userSelections');

        // FORMAT COUPON
        if (formData.coupon) {
            formData.coupon = formData.coupon.toUpperCase();
        }

        // GET ROOM DATA
        var room = this.data.room;

        // COMBINE ALL AVAILABLE DATA BEFORE CREATING RESERVATION OBJECT
        var reservationData = _.extend(userSelections, formData);
        var reservation = new Bolt.Reservation(_.extend(reservationData, {
            roomId: room._id,
            room: room
        }));

        // IF RESERVATION DATA IS OK
        if (reservation.isValid()) {

            // GRAB GAME DATA
            var game = new Bolt.Game(Session.get('game'));

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
                // console.log( 'FB EVENT DATA', fbe );
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
                    action: "Reservation " + "(pay: " + reservation.pay + ")",
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

                ga('send', gae.event, gae.category, gae.action, gae.label, parseInt(reservation.subtotal));

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

                // SEND EMAILS
                reservation.sendConfirmationEmail();
                reservation.sendNotificationEmail();

                // SEND SMS
                reservation.sendNotificationSMS(game, reservation.total + ' due at check-in');

                // SEND CUSTOMER INFO TO SQUARE
                reservation.sendCustomerInfoToSquare();

                // HIDE LOADING GIF
                Bolt.hideLoadingAnimation();

                // GO TO CONFIRMATION
                Router.go('confirmation', { _id: resId });

            }

        } else {
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
    var self = this;
    // var createPaymentForm = function() {
    //     $.getScript("https://js.squareup.com/v2/paymentform").done(function () {
    //         paymentForm = new SqPaymentForm({
    //             // Setup your SqPaymentForm object, see https://docs.connect.squareup.com/payments/sqpaymentform/sqpaymentform-setup
    //             // for more details
    //         });
    //         // We're manually building the form here, since the page is already loaded and won't trigger the event SqPaymentForm
    //         // is expecting
    //         paymentForm.build();
    //     });
    // }

    // Set the application ID
    var applicationId = Meteor.settings.public.square.applicationId;

// Set the location ID
    var locationId = Meteor.settings.public.square.locationId;

    /*
     * function: requestCardNonce
     *
     * requestCardNonce is triggered when the "Pay with credit card" button is
     * clicked
     *
     * Modifying this function is not required, but can be customized if you
     * wish to take additional action when the form button is clicked.
     */
    function requestCardNonce(event) {

        // Don't submit the form until SqPaymentForm returns with a nonce
        event.preventDefault();

        // Request a nonce from the SqPaymentForm object
        self.paymentForm.requestCardNonce();
    }

// Create and initialize a payment form object
    this.paymentForm = new SqPaymentForm({

        // Initialize the payment form elements
        applicationId: applicationId,
        locationId: locationId,
        inputClass: 'sq-input',

        // Customize the CSS for SqPaymentForm iframe elements
        inputStyles: [{
            fontSize: '.9em'
        }],

        // Initialize Apple Pay placeholder ID
        applePay: {
            elementId: 'sq-apple-pay'
        },

        // Initialize Masterpass placeholder ID
        masterpass: {
            elementId: 'sq-masterpass'
        },

        // Initialize the credit card placeholders
        cardNumber: {
            elementId: 'sq-card-number',
            placeholder: '•••• •••• •••• ••••'
        },
        cvv: {
            elementId: 'sq-cvv',
            placeholder: 'CVV'
        },
        expirationDate: {
            elementId: 'sq-expiration-date',
            placeholder: 'MM/YY'
        },
        postalCode: {
            elementId: 'sq-postal-code'
        },

        // SqPaymentForm callback functions
        callbacks: {

            /*
             * callback function: methodsSupported
             * Triggered when: the page is loaded.
             */
            methodsSupported: function (methods) {

                var applePayBtn = document.getElementById('sq-apple-pay');
                var applePayLabel = document.getElementById('sq-apple-pay-label');
                var masterpassBtn = document.getElementById('sq-masterpass');
                var masterpassLabel = document.getElementById('sq-masterpass-label');

                // Only show the button if Apple Pay for Web is enabled
                // Otherwise, display the wallet not enabled message.
                if (methods.applePay === true) {
                    applePayBtn.style.display = 'inline-block';
                    applePayLabel.style.display = 'none' ;
                }
                // Only show the button if Masterpass is enabled
                // Otherwise, display the wallet not enabled message.
                if (methods.masterpass === true) {
                    masterpassBtn.style.display = 'inline-block';
                    masterpassLabel.style.display = 'none';
                }
            },

            /*
             * callback function: createPaymentRequest
             * Triggered when: a digital wallet payment button is clicked.
             */
            createPaymentRequest: function () {

                var paymentRequestJson ;
                /* ADD CODE TO SET/CREATE paymentRequestJson */
                return paymentRequestJson ;
            },

            /*
             * callback function: validateShippingContact
             * Triggered when: a shipping address is selected/changed in a digital
             *                 wallet UI that supports address selection.
             */
            validateShippingContact: function (contact) {

                var validationErrorObj ;
                /* ADD CODE TO SET validationErrorObj IF ERRORS ARE FOUND */
                return validationErrorObj ;
            },

            /*
             * callback function: cardNonceResponseReceived
             * Triggered when: SqPaymentForm completes a card nonce request
             */
            cardNonceResponseReceived: function(errors, nonce, cardData, billingContact, shippingContact) {
                if (errors) {
                    // Log errors from nonce generation to the Javascript console
                    console.log("Encountered errors:");
                    errors.forEach(function(error) {
                        Notifications.error(error.message);
                    });

                    return;
                }

                // console.log('Nonce received', nonce); /* FOR TESTING ONLY */

                // Assign the nonce value to the hidden form field
                // document.getElementById('card-nonce').value = nonce;
                $('[hook="nonce"]').val(nonce);

                // SUBMIT ORDER
                self.submitOrder();

                // POST the nonce form to the payment processing page
                // document.getElementById('nonce-form').submit();

            },

            /*
             * callback function: unsupportedBrowserDetected
             * Triggered when: the page loads and an unsupported browser is detected
             */
            unsupportedBrowserDetected: function() {
                /* PROVIDE FEEDBACK TO SITE VISITORS */
            },

            /*
             * callback function: inputEventReceived
             * Triggered when: visitors interact with SqPaymentForm iframe elements.
             */
            inputEventReceived: function(inputEvent) {
                switch (inputEvent.eventType) {
                    case 'focusClassAdded':
                        /* HANDLE AS DESIRED */
                        break;
                    case 'focusClassRemoved':
                        /* HANDLE AS DESIRED */
                        break;
                    case 'errorClassAdded':
                        /* HANDLE AS DESIRED */
                        break;
                    case 'errorClassRemoved':
                        /* HANDLE AS DESIRED */
                        break;
                    case 'cardBrandChanged':
                        /* HANDLE AS DESIRED */
                        break;
                    case 'postalCodeChanged':
                        /* HANDLE AS DESIRED */
                        break;
                }
            },

            /*
             * callback function: paymentFormLoaded
             * Triggered when: SqPaymentForm is fully loaded
             */
            paymentFormLoaded: function() {
                /* HANDLE AS DESIRED */
            }
        }
    });

    // Grab room info
    var room = this.data.room;


    if( this.data.room.available ) {
        this.paymentForm.build();
    }

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

    // console.log( room ) ;
    var minDate = Epoch.today();
    if( room.openingDate > minDate ){
        minDate = room.openingDate;
        // console.log( 'minDate1', minDate );
        var us = Session.get('userSelections');
        if( !us.date || us.date < minDate ) {
            us.date = minDate;
            // console.log( 'minDate2', minDate );
            Session.set('userSelections',us);
        }
    }

    // console.log( 'minDate3', minDate );

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

    });
});


/**
 * =============================================================
 * TEMPLATE DESTROYED
 * =============================================================
 */
Template.room.onDestroyed(function(){

});

/**
 * =============================================================
 * TEMPLATE EVENTS
 * =============================================================
 */
Template.room.events({
    'click button#sq-creditcard': function(event, templateInstance) {

        event.preventDefault();
        // templateInstance.submitOrder();
        templateInstance.paymentForm.requestCardNonce();
        // alert('Request nonce');

    },
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
        // tmpl.submitOrder();

    },
    'click [hook="checkout"]': function(evt,tmpl){

        evt.preventDefault();
        // tmpl.submitOrder();

    }
});


/**
 * =============================================================
 * TEMPLATE HELPERS
 * =============================================================
 */
Template.room.helpers({
    // tempReservationPublicId(){
    //
    //     return Math.floor(10000000 + Math.random() * 90000000);
    //
    // },

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
    isGMTrained: function( args ){
        var tmpl = this;
        var gm = Meteor.users.findOne( { _id: args.hash.game.userId } );
        // console.log( 'is GM Trained?', args.hash.room, args.hash.game );
        var isGMTrained = false;
        _.each( gm.profile.rooms, function( roomId ){
            if( roomId == args.hash.room._id ){
                isGMTrained = true;
            }
        });
        return isGMTrained;
    },
    game: function(){
        return Session.get( 'game' );
    },
    games: function(){
        console.log( 'in games. Do i have room id?', this );
        var tmpl = this;

        if( Session.get('game') ) {
            var game = new Bolt.Game(Session.get('game'));


            console.log(game);
            var games = Bolt.Collections.Games.find({
                date: game.date,
                $or: [
                    {roomId: game.roomId},
                    {roomId: 'any'}
                ]
            }, {
                sort: {time: 1}
            }).fetch();
            console.log(games);

            var isGMTrained = false;
            var gamesToDisplay = [];
            _.each( games, function( game ){
                var gm = Meteor.users.findOne( { _id: game.userId } );
                _.each( gm.profile.rooms, function( roomId ){
                    if( roomId == tmpl.room._id ){
                        gamesToDisplay.push( game );
                    }
                });
            });

            // console.log('GAMES? ', games);
            return gamesToDisplay;
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

        if( successRates && successRates[tmpl.room._id]){
            return successRates[tmpl.room._id].successRate || tmpl.room.successRate;
        }else {
            return tmpl.room.successRate;
        }
    }
});

