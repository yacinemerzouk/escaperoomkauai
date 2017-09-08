Template.calendarFormAddPayment.onCreated(function(){
    Session.set('paymentMethod', 'ccSwiped');
});

Template.calendarFormAddPayment.helpers({
    reservation: function(){
        return new Bolt.Reservation( parseInt(this.reservationId) );
    },
    payNow: function(){
        return Session.get('paymentMethod') == 'ccAdmin' ? true : false;
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

Template.calendarFormAddPayment.events({
    'click [hook="calendar-form-background"]': function(evt,tmpl){
        Blaze.remove(tmpl.view);
    },
    'click [hook="calendar-form-close"]': function(evt,tmpl){
        Blaze.remove(tmpl.view);
    },
    'change [hook="payment-method"]': function(evt,tmpl){
        var paymentMethod = $(evt.target).val();
        Session.set('paymentMethod', paymentMethod);
    },
    'submit [hook="calendar-payment-form"]': function(evt,tmpl){
        evt.preventDefault();
        Bolt.showLoadingAnimation();
        var formData = Bureaucrat.getFormData( $(evt.target) );
        // console.log( 'form data', formData );
        var game = new Bolt.Game({reservationPublicId:parseInt( formData.publicId )});
        var paymentMethod = Session.get('paymentMethod');
        if( paymentMethod == 'ccSwiped' ){

            game.addTransaction({
                reservationPublicId:parseInt( formData.publicId ),
                amount: formData.amount,
                ccTransaction: {
                    id: formData.ccTransactionId,
                    total: parseInt( parseFloat(formData.amount).toFixed(2) * 100 )
                }
            });
            var saved = game.save();

            if( saved ){
                Notifications.success('Payment Processed');
                Blaze.renderWithData(Template.calendarFormEditGame,{gameId:game._id},$('body')[0]);
                Blaze.remove(tmpl.view);
                Bolt.hideLoadingAnimation();

            }

        }else{

            var reservation = new Bolt.Reservation( parseInt( formData.publicId ) );
            Stripe.card.createToken({
                number: formData.cc,
                exp_month: formData.ccExpMonth,
                exp_year: formData.ccExpYear,
                cvc: formData.cvv,
            }, function (status, response) {
                if( status == 200 ){

                    var token = response.id;
                    Meteor.call(
                        'chargeCard',
                        token,
                        parseInt( parseFloat(formData.amount) * 100 ),
                        reservation.email,
                        function(error, response){
                            if( error ){
                                // console.log( 'Charge card error', error );
                            }else{
                                // console.log( 'CHARGE SUCCEEDED', token, parseInt(parseFloat(formData.amount)*100),reservation.email,error,response);
                                game.addTransaction({
                                    reservationPublicId:parseInt( formData.publicId ),
                                    amount: formData.amount,
                                    ccTransaction: response
                                });
                                var saved = game.save();

                                if( saved ){
                                    Notifications.success('Payment Processed');
                                    Blaze.renderWithData(Template.calendarFormEditGame,{gameId:game._id},$('body')[0]);
                                    Bolt.hideLoadingAnimation();
                                    Blaze.remove(tmpl.view);

                                }
                            }
                        }

                    );

                }else{
                    // console.log( 'Token error?', status, response );
                    Bolt.hideLoadingAnimation();
                }


            });



        }
    }
});