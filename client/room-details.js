Template.room.onRendered(function(){
    console.log( 'Firing datepicker!' );
    var defaultDate;
    if( Session.get( 'selectedDate' ) ){
        defaultDate = Session.get( 'selectedDate' );
    }else{
        defaultDate = Epoch.dateObjectToDateString(new Date());
        Session.set( 'selectedDate', defaultDate );
    }

    var fireDatepicker = function() {
        $('#datepicker').datepicker({
            minDate: 0,
            dateFormat: 'yy-mm-dd',
            defaultDate: defaultDate,
            onSelect: function (dateText, inst) {
                $('.ui-state-highlight').removeClass("ui-state-highlight");
                Session.set('selectedDate', dateText);
                Session.set('selectedTime', false);
            }
        });
    }

    setTimeout( fireDatepicker, 2000 );

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
    kamaainaPlayersOptions: function(){
        var kamaainaPlayersOptions = [];
        var spotsLeft = EscapeRoom.spotsLeft( this._id, Session.get('selectedDate'), Session.get('selectedTime') );
        if( this ){
            for( var x = 0; x <= this.maxPlayers && x <= Session.get('selectedNbPlayers'); x++ ){
                if( x <= spotsLeft ) {
                    kamaainaPlayersOptions.push(x);
                }
            }
        }
        return kamaainaPlayersOptions;
    },
    hasKamaainaPlayers: function(){
        var nbKamaaina = Session.get( 'selectedNbKamaaina');
        return nbKamaaina && nbKamaaina != '0' && parseInt(nbKamaaina) > 0;
    },
    hasCoupon: function(){
        var coupon = Session.get('couponDiscount');
        return coupon && parseInt(coupon) > 0;
    },
    couponDiscount: function(){
        return Session.get('couponDiscount');
    },
    selectedNbPlayers: function(){
        return Session.get('selectedNbPlayers');
    },
    selectedNbKamaaina: function(){
        return Session.get('selectedNbKamaaina');
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
    calculatedKamaainaDiscount: function(){
        return EscapeRoom.calculateKamaaina( Session.get('selectedNbKamaaina') );
    },
    calculatedCouponDiscount: function(){
        return  EscapeRoom.calculateDiscount(
            this._id,
            Session.get('selectedNbPlayers'),
            Session.get('couponDiscount'),
            Session.get('selectedCloseRoom')
        );
    },
    calculatedTaxes: function(){
        return EscapeRoom.calculateTaxes(
            this._id,
            Session.get('selectedNbPlayers'),
            Session.get('selectedNbKamaaina'),
            Session.get('couponDiscount'),
            Session.get('selectedCloseRoom')
        )
    },
    calculatedTotal: function(){
        // var nbPlayersCost;
        // var closeRoomCost;
        // if( Session.get('selectedNbPlayers') ){
        //     nbPlayersCost = parseInt( Session.get('selectedNbPlayers') ) * this.pricePerPlayer;
        // }else{
        //     nbPlayersCost = 0;
        // }
        // if( Session.get('selectedCloseRoom') && EscapeRoom.canClose( this._id, Session.get('selectedDate'), Session.get('selectedTime') ) ){
        //     closeRoomCost = this.priceToClose;
        // }else{
        //     closeRoomCost = 0;
        // }
        // var nbKamaaina = Session.get( 'selectedNbKamaaina');
        // var kamaainaDiscount = 0;
        // if( nbKamaaina && nbKamaaina != '0' ){
        //     kamaainaDiscount = 5 * parseInt(nbKamaaina);
        // }
        // return nbPlayersCost + closeRoomCost - kamaainaDiscount;
        return EscapeRoom.calculateTotal(
            this._id,
            Session.get('selectedNbPlayers'),
            Session.get('selectedNbKamaaina'),
            Session.get('couponDiscount'),
            Session.get('selectedCloseRoom')
        );
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
    enteredCoupon: function(){
        return Session.get('enteredCoupon');
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
        return EscapeRoom.canClose(
            this._id,
            Session.get('selectedDate'),
            Session.get('selectedTime')
        );
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
    'change [hook="enteredCoupon"]': function(evt,tmpl){
        var availableCoupons = [
            { coupon:'YAXTEST', discount: 95 },
            { coupon:'HERSHEL', discount: 50, limitDateFrom: '2016-07-23', limitDateTo: '2016-08-05' },
            { coupon:'GRANDOPENING', discount: 50, limitDateFrom: '2016-07-23', limitDateTo: '2016-07-27'}
        ];
        var enteredCoupon = evt.target.value;
        Session.set('couponDiscount',0);
        _.each(availableCoupons,function(availableCoupon){
            if( availableCoupon.coupon.toLowerCase() == enteredCoupon.toLowerCase() ){
                var selectedDate = Session.get('selectedDate');
                if( coupon.limitDateFrom && coupon.limitDateTo ){
                    if( selectedDate >= coupon.limitDateFrom && selected <= coupon.limitDateTo ){
                        Session.set('couponDiscount',availableCoupon.discount);
                    }
                }else{
                    Session.set('couponDiscount',availableCoupon.discount);
                }
           }
        });
        Session.set('enteredCoupon',evt.target.value);
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
        }else {
            // check for discount adjustment
            var selectedKamaaina = Session.get('selectedNbKamaaina');
            if (selectedKamaaina && parseInt(selectedKamaaina) > parseInt(nbPlayers) ){
                Session.set('selectedNbKamaaina', nbPlayers);
            }
        }
        Session.set( 'selectedNbPlayers', nbPlayers );
    },
    'change [hook="nbKamaaina"]': function(evt,tmpl){
        var nbKamaaina = $(evt.currentTarget).val();
        Session.set( 'selectedNbKamaaina', nbKamaaina );
    },
    'change [hook="closeRoom"]': function(evt,tmpl){
        var closeRoom = $(evt.target).is(':checked');
        Session.set( 'selectedCloseRoom', closeRoom );
    },
    'click [hook="checkout"]': function(evt,tmpl){

        $('.processing-bg').show()

        // var nbPlayersCost;
        // var closeRoomCost;
        // if( Session.get('selectedNbPlayers') ){
        //     nbPlayersCost = parseInt( Session.get('selectedNbPlayers') ) * this.pricePerPlayer;
        // }else{
        //     nbPlayersCost = 0;
        // }
        // if( Session.get('selectedCloseRoom') && EscapeRoom.canClose( this._id, Session.get('selectedDate'), Session.get('selectedTime') ) ){
        //     closeRoomCost = this.priceToClose;
        // }else{
        //     closeRoomCost = 0;
        // }
        var total = EscapeRoom.calculateTotal(
            tmpl.data._id,
            Session.get('selectedNbPlayers'),
            Session.get('selectedNbKamaaina'),
            Session.get('couponDiscount'),
            Session.get('selectedCloseRoom')
        ) * 100;

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
                        $('.processing-bg').hide()
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