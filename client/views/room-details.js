Template.room.onCreated(function(){

    Meteor.subscribe( 'rooms' );

    this.updateReservation = function( formData ){

        var formData = formData || Bureaucrat.getFormData( $( '[hook="reservation-form"]' ) );
        var reservation = new Bolt.Reservation( Session.get('reservation') );
        if( formData.coupon ) {
            formData.coupon = formData.coupon.toUpperCase();
        }
        reservation.populate( formData );
        Session.set( 'reservation',reservation );
    }

    this.submitOrder = function(){


        var reservation = new Bolt.Reservation( Session.get( 'reservation' ) );

        if( reservation.isValid() ){

            // analytics.track("Booking", {
            //     name: reservation.room.title + ' Booking',
            //     revenue: reservation.total
            // });

            $('.processing-bg').show()

            if( reservation.total == 0 ){

                var lastRes = Bolt.Collections.Reservations.findOne({}, {sort: {publicId: -1}});

                if (lastRes && lastRes.publicId) {
                    reservation.publicId = lastRes.publicId + 1;
                } else {
                    reservation.publicId = 350000;
                }

                reservation.transaction = {
                    amount: 0
                }

                var resId = reservation.save();

                if( resId ){

                    if ( reservation.coupon && reservation.couponData ){

                        Bolt.Collections.Coupons.update(
                            {
                                _id: reservation.couponData._id
                            },
                            {
                                $inc: {
                                    uses: 1
                                }
                            }
                        );
                    }

                    reservation.sendConfirmationEmail();
                    reservation.sendNotificationEmail();

                    // Configure the Twilio client
                    var SMSString = "New Booking - " +
                        reservation.room.title +
                        " - " +
                        reservation.date +
                        " @ " +
                        reservation.time +
                        " - " +
                        reservation.nbPlayers + " players" +
                        " - " +
                        "$0.00";
                    Meteor.call('sendAdminNotificationSMS', SMSString, function(error,response){
                        if( error ) {
                            // console.log( error );
                            new Meteor.Error("[roomDetails][submitOrder][sendSMS] Error", error.message);
                        }else{
                            // console.log( response );
                        }

                    });


                    $('.processing-bg').hide();
                    Router.go('confirmation', {_id:resId});

                }

            }else {

                Stripe.card.createToken({
                    number: reservation.cc,
                    exp_month: reservation.ccExpMonth,
                    exp_year: reservation.ccExpYear,
                    cvc: reservation.cvv,
                }, function (status, response) {

                    var stripeToken = response.id;

                    Meteor.call('chargeCard', stripeToken, parseInt( reservation.total * 100 ), function (error, result) {

                        if (error) {

                            $('.processing-bg').hide();
                            Notifications.error(error.message, 'Sorry. We could not process your card. Please call 808.635.6957');

                        } else if (result) {

                            var lastRes = Bolt.Collections.Reservations.findOne({}, {sort: {publicId: -1}});

                            if (lastRes && lastRes.publicId) {
                                reservation.publicId = lastRes.publicId + 1;
                            } else {
                                reservation.publicId = 350000
                            }

                            reservation.transaction = result;

                            var resId = reservation.save()

                            if ( resId ) {

                                if ( reservation.coupon && reservation.couponData ){

                                    Bolt.Collections.Coupons.update(
                                        {
                                            _id: reservation.couponData._id
                                        },
                                        {
                                            $inc: {
                                                uses: 1
                                            }
                                        }
                                    );
                                }

                                // Track conversion
                                // analytics.track("Completed Order", {
                                //     eventName: reservation.room.title,
                                //     couponValue: reservation.total,
                                // });
                                var discount = parseFloat( reservation.discount ) + parseFloat( reservation.discountKamaaina );
                                var revenue = parseFloat( reservation.subtotal - discount ).toFixed(2);
                                var coupon = reservation.couponData && reservation.couponData.coupon ? reservation.couponData.coupon : "";
                                var room = Bolt.Collections.Rooms.findOne(reservation.roomId);
                                var products = [
                                    {
                                        product_id: reservation.roomId,
                                        sku: 'KER-'+reservation.roomId,
                                        name: room.title,
                                        price: room.pricePerPlayer,
                                        quantity: reservation.nbPlayers,
                                        category: 'Escape Room'
                                    }
                                ];
                                if( reservation.closeRoom ){
                                    products.push({
                                        product_id: 'CLOSEDROOMFEE',
                                        sku: 'KER-CLOSEDROOMFEE',
                                        name: 'Closed Room Fee',
                                        price: room.priceToClose,
                                        quantity: 1,
                                        category: 'Escape Room'
                                    });
                                }
                                var trackRes = analytics.track("Order Completed", {
                                    checkout_id: reservation.publicId,
                                    order_id: reservation._id,
                                    affiliation: 'Kauai Escape Room',
                                    total: reservation.total,
                                    revenue: revenue,
                                    shipping: 0,
                                    tax: reservation.taxes,
                                    discount: discount,
                                    coupon: coupon,
                                    currency: 'USD',
                                    products: products
                                });

                                reservation.sendConfirmationEmail();
                                reservation.sendNotificationEmail();

                                // Configure the Twilio client
                                var SMSString = "New Booking - " +
                                    reservation.room.title +
                                    " - " +
                                    reservation.date +
                                    " @ " +
                                    reservation.time +
                                    " - " +
                                    reservation.nbPlayers + " players" +
                                    " - " +
                                    "$" + reservation.total;
                                Meteor.call('sendAdminNotificationSMS', SMSString, function(error,response){
                                    if( error ) {
                                        // console.log( error );
                                        new Meteor.Error("[roomDetails][submitOrder][sendSMS] Error", error.message);
                                    }else{
                                        // console.log( response );
                                    }

                                });

                                $('.processing-bg').hide();
                                // console.log( 'track res', trackRes, {
                                //     checkout_id: reservation.publicId,
                                //     order_id: reservation._id,
                                //     affiliation: 'Kauai Escape Room',
                                //     total: reservation.total,
                                //     revenue: revenue,
                                //     shipping: 0,
                                //     tax: reservation.taxes,
                                //     discount: discount,
                                //     coupon: coupon,
                                //     currency: 'USD',
                                //     products: products
                                // } )
                                Router.go('confirmation', {_id:resId});

                            } else {
                                Notifications.error('Charge OK but Reservation failed', 'Please call 808.635.6957');
                            }
                        } else {
                            Notifications.error('Payment Processing Error', 'Sorry. We could not process your card. Please call 808.635.6957');
                        }
                    });

                });
            }

        }

    }
});
Template.room.onRendered(function(){

    console.log(this.data);

    var reservation = new Bolt.Reservation( Session.get('reservation') || {room: this.data, date:Epoch.dateObjectToDateString(new Date())} );


    var self = this;

    this.autorun(function() {

        // hack to force the autorun to reevaluate
        Template.currentData();



        // check that time is in startTimes array
        if( _.indexOf(self.data.startTimes, reservation.time) === -1 ){
            delete reservation.time;
        }

        reservation.roomId = self.data._id;
        reservation.room = self.data;

        var minDate = Epoch.dateObjectToDateString(new Date());
        //console.log( minDate );
        if( reservation.room && reservation.room.openingDate && reservation.room.openingDate > minDate ){
            minDate = reservation.room.openingDate;
        }
        if( reservation.date < reservation.room.openingDate ){
            reservation.date = reservation.room.openingDate;
        }
        var maxDate = '2017-12-31';
        if( reservation.room && reservation.room.maxDate ){
            maxDate = reservation.room.maxDate;
        }

        $('#datepicker').datepicker({
            minDate: minDate,
            maxDate: maxDate,
            dateFormat: 'yy-mm-dd',
            defaultDate: reservation.date,
            onSelect: function (dateText, inst) {
                $('.ui-state-highlight').removeClass("ui-state-highlight");
                var formData = Bureaucrat.getFormData($('[hook="reservation-form"]'));
                if (formData) {
                    reservation.populate(formData);
                }
                reservation.date = dateText;
                reservation.time = false;
                Session.set('reservation', reservation);
                Router.go('roomByDate',{slug:reservation.room.slug,date:dateText});
                //Router.go('/room/'+reservation.room.slug+'/'+dateText+'#booknow');
                // console.log('Route change?');
            }
        });

        Session.set( 'reservation', reservation );

        if( window.location.pathname !== '/room/'+reservation.room.slug ){
            $('html, body').scrollTop($('#booknow').offset().top);
        }

    });


});

Template.room.helpers({

    years: function(){
        var currentYear = new Date().getFullYear();
        var years = [];
        for( var x = currentYear; x < currentYear + 10; x++ ){
            years.push( x );
        }
        return years;
    },

    reservation: function(){
        return Session.get( 'reservation' );
    },

    // hasEnoughSpots: function(reservation){
    //     var spotsLeft = Bolt.spotsLeft(reservation.roomId, reservation.date, reservation.time);
    //     return spotsLeft >= reservation.nbPlayers ? true : false;
    // },
    isFree: function(){
        var reservation = new Bolt.Reservation( Session.get('reservation') );
        return reservation.total == 0 ? true : false;
    },
    nbPlayersOptions: function(  ){
        var nbPlayersOptions = [];
        var spotsLeft;
        var reservation = Session.get('reservation');
        if( reservation.date && reservation.time ){
            spotsLeft = Bolt.spotsLeft( reservation.room._id, reservation.date, reservation.time );
        }else{
            spotsLeft = reservation.room.maxPlayers;
        }
        if( this ){
            for( var x = reservation.room.minPlayers; x <= reservation.room.maxPlayers; x++ ){
                if( x <= spotsLeft ) {
                    nbPlayersOptions.push(x);
                }
            }
        }
        // //console.log('nbPlayersOptions', this, nbPlayersOptions);
        return nbPlayersOptions;
    },
    kamaainaPlayersOptions: function(){
        var kamaainaPlayersOptions = [];
        var reservation = Session.get('reservation');
        //var spotsLeft = Bolt.spotsLeft( reservation.room._id, reservation.date, reservation.time );
        //if( this ){
        for( var x = 0; x <= reservation.nbPlayers; x++ ){

            kamaainaPlayersOptions.push(x);

        }
        //}
        return kamaainaPlayersOptions;
    },
    canClose: function(){
        var reservation = new Bolt.Reservation(Session.get('reservation'));
        return reservation.canClose();
    },

    startTimes: function(){
        var reservation = new Bolt.Reservation(Session.get('reservation'));
        //console.log( 'in startTimes', reservation.date );
        return Bolt.getPossibleTimes(reservation.date, reservation.roomId);
    },
    dynamicSuccessRate: function(){
        var games = Bolt.Collections.Games.find( { roomId: this._id } ).fetch();
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
            return this.successRate;
        }else{
            return Math.ceil(nbGamesWon / nbGames * 100);
        }
    },
    settings: function () {
        return Bolt.Collections.Settings.findOne({settingType: 'global'});
    }

});

Template.room.events({

    'change [hook="update-reservation"]': function( evt, tmpl ){

        tmpl.updateReservation();

    },
    'change [hook="update-players"]': function( evt, tmpl ){

        var formData = Bureaucrat.getFormData( $( '[hook="reservation-form"]' ) );
        if( formData.nbKamaaina && formData.nbPlayers < formData.nbKamaaina ){
            formData.nbKamaaina = formData.nbPlayers;
        }
        var reservation = new Bolt.Reservation( Session.get('reservation') );

        if( !formData.nbPlayers ){
            formData.nbPlayers = 0;
        }
        if( formData.nbPlayers == reservation.room.maxPlayers || formData.nbPlayers == reservation.room.maxPlayers-1 ){
            formData.closeRoom = false;
        }

        tmpl.updateReservation(formData);

    },
    'keyup [hook="update-coupon"]': function( evt, tmpl ){

        var formData = Bureaucrat.getFormData( $( '[hook="reservation-form"]' ) );
        if( !formData.coupon ){
            formData.coupon = false;
            formData.discount = 0;
        }
        tmpl.updateReservation( formData );

    },
    'click [hook="set-time"]': function(evt,tmpl){
        evt.preventDefault();
        var reservation = new Bolt.Reservation( Session.get('reservation') );
        if( $(evt.currentTarget).hasClass('button-unavailable') && reservation.nbPlayers ){
            Notifications.error('Too many players.','There are not enough spots left for the number of players you selected.');
        }else{
            reservation.time = $(evt.currentTarget).attr('hook-data');
            Session.set( 'reservation',reservation );
        }
    },
    // 'change [hook="nbPlayers"]': function(evt,tmpl){
    //     var nbPlayers = $(evt.currentTarget).val();
    //     if( nbPlayers == '0' ){
    //         nbPlayers = false;
    //     }else {
    //         // check for discount adjustment
    //         var selectedKamaaina = Session.get('selectedNbKamaaina');
    //         if (selectedKamaaina && parseInt(selectedKamaaina) > parseInt(nbPlayers) ){
    //             Session.set('selectedNbKamaaina', nbPlayers);
    //         }
    //     }
    //     Session.set( 'selectedNbPlayers', nbPlayers );
    // },

    'submit form': function(evt,tmpl){

        evt.preventDefault();
        tmpl.submitOrder();

    },
    'click [hook="checkout"]': function(evt,tmpl){

        evt.preventDefault();
        tmpl.submitOrder();

    }
});