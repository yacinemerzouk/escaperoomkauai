/**
 * =============================================================
 * DATA CONTEXT
 * Template data: params
 * Router subscriptions: none
 * Template subscriptions: none
 * =============================================================
 */

/**
 * =============================================================
 * TEMPLATE CREATED
 * =============================================================
 */
Template.giftCards.onCreated(function(){
    this.updateCheckoutValues = function(){
        var couponValue = parseFloat( $('[hook="update-amount"]').val() ).toFixed(2);
        var deliveryOption = $('[hook="change-delivery"]:checked').val();
        var deliveryFee = 0.00;
        if( deliveryOption == 'mail' ){
            deliveryFee = 5.00;
        }
        var subtotal = parseFloat( parseFloat( couponValue ) + parseFloat( deliveryFee ) ).toFixed(2);
        var taxes = parseFloat( parseFloat( subtotal ) * 0.04166 ).toFixed(2);
        var total = parseFloat( parseFloat( subtotal ) + parseFloat( taxes ) ).toFixed(2);

        var checkoutData = {
            couponValue: couponValue,
            deliveryFee: deliveryFee,
            subtotal: subtotal,
            taxes: taxes,
            total: total
        }
        // console.log( 'CHECKOUT DATA', checkoutData );
        Session.set( 'checkoutData', checkoutData );

        //couponValueInput.val( )

    }

    // FORM HANDLER
    this.submitOrder = function(){

        // GET FORM DATA
        var formData = Bureaucrat.getFormData( $( 'form' ) );

        // console.log( 'FORM DATA', formData );

        // IF FORM HAS ALL DATA NEEDED
        if( formData.couponValue &&
            formData.sender &&
            formData.recipient &&
            formData.senderEmail &&
            formData.deliveryFee &&
            formData.subtotal &&
            formData.taxes &&
            formData.total &&
            formData.cc &&
            formData.ccExpMonth &&
            formData.ccExpYear &&
            formData.cvv) {

            var totalInCents = parseInt( parseFloat( formData.total ) * 100 );

            // SHOW LOADER
            Bolt.showLoadingAnimation();

            // START STRIPE TRANSACTION
            // CREATE TOKEN
            Stripe.card.createToken({
                number: formData.cc,
                exp_month: formData.ccExpMonth,
                exp_year: formData.ccExpYear,
                cvc: formData.cvv,

                // TOKEN CALLBACK
            }, function (status, response) {

                // console.log( 'CREATED TOKEN', status, response );

                // TOKEN RETRIEVED SUCCESSFULLY
                if( status == 200 ) {

                    // GET TOKEN
                    var stripeToken = response.id;

                    // MAKER SERVER-SIDE CALL TO CHARGE CARD
                    Meteor.call(
                        'chargeCard',               // METEOR METHOD
                        stripeToken,                // TOKEN
                        totalInCents,   // TOTAL AMOUNT IN CENTS
                        formData.senderEmail,       // EMAIL OF BUYER
                        function (error, result) {  // CALLBACK

                            // console.log( 'BACK FROM CHARGECARD' );

                            // HANDLE ERRORS
                            if (error) {

                                // HIDE LOADER
                                Bolt.hideLoadingAnimation();

                                // DISPLAY ERROR FOR CUSTOMER
                                Notifications.error(error.message, 'Sorry. We could not process your card. Please call 808.635.6957');

                                // CHARGE SUCCESSFUL!
                            } else if (result) {

                                // console.log( 'GENERATING COUPON' );

                                // Create coupon
                                var couponData = formData;
                                couponData.coupon = 'K' + Random.hexString(8).toUpperCase();
                                couponData.coupon.replace('0', 'B');
                                couponData.coupon.replace('O', 'A');
                                couponData.coupon.replace('1', 'L');
                                couponData.coupon.replace('I', 'X');
                                couponData.discount = formData.couponValue;
                                couponData.maxUses = 1;
                                couponData.type = 'DOLLARS'
                                couponData.transaction = result;

                                // INSERT COUPON DATA IN COUPONS COLLECITON
                                var couponDataToInsert = _.pick(
                                    couponData,
                                    [
                                        'coupon',
                                        'delivery',
                                        'discount',
                                        'maxUses',
                                        'recipient',
                                        'recipientAddress',
                                        'recipientEmail',
                                        'sender',
                                        'senderEmail',
                                        'transaction',
                                        'type'
                                    ]
                                );
                                // console.log( 'COUPON DATA TO INSERT', couponDataToInsert );
                                var result = Bolt.Collections.Coupons.insert( couponDataToInsert );

                                // INSERT OK
                                if (result) {

                                    var fbe = {
                                        value: formData.total,
                                        currency: 'USD'
                                    }
                                    // console.log( 'FB EVENT DATA', fbe );

                                    fbq(
                                        'track',
                                        'Purchase',
                                        {
                                            value: fbe.value,
                                            currency: fbe.currency
                                        }
                                    );



                                    // GA EVENT TRACKING
                                    var gae = {
                                        event: 'event',
                                        category: 'Transaction',
                                        action: 'Gift Card',
                                        label: "Gift Card Purchase (delivery method: " + formData.delivery + ")",
                                        total: formData.total,
                                        couponValue: formData.couponValue,
                                        transactionId: couponData.transaction.id,
                                        deliveryFee: formData.deliveryFee,
                                        taxes: formData.taxes

                                    };
                                    // console.log( 'GA EVENT DATA', gae );
                                    ga( 'send', gae.event, gae.category, gae.action, gae.label, parseInt( gae.couponValue ) );

                                    ga('ecommerce:addTransaction', {
                                        'id': gae.transactionId,                     // Transaction ID. Required.
                                        'revenue': gae.total,               // Grand Total.
                                        'shipping': gae.deliveryFee,                  // Shipping.
                                        'tax': gae.taxes                    // Tax.
                                    });
                                    ga('ecommerce:addItem', {
                                        'id': gae.transactionId,                     // Transaction ID. Required.
                                        'name': 'Gift Card',    // Product name. Required.
                                        'sku': 'KER-GIFTCARD',                 // SKU/code.
                                        'category': 'Gift Card',         // Category or variation.
                                        'price': gae.couponValue,                 // Unit price.
                                        'quantity': '1'                   // Quantity.
                                    });
                                    ga('ecommerce:send');

                                    var bodyConfirmation = '<div style="background-color: #ddd; padding: 30px;">' +
                                        '<div style="padding: 0px; width: 120px; margin: 0 auto; ">' +
                                        '<img src="https://www.escaperoomkauai.com/images/social-banner-logo.png" width="120" height="120">' +
                                        '</div>' +
                                        '<br><br>' +
                                        '<div style="background-color: #fff; padding: 30px; max-width: 380px; margin: 0 auto; ">' +
                                        'KAUAI ESCAPE ROOM - GIFT CARD PURCHASE CONFIRMATION</b>' +
                                        '<br><br>' +
                                        'Gift card for: ' + couponData.recipient +
                                        '<br><br>' +
                                        'Gift card amount: $' + parseFloat(couponData.discount).toFixed(2) +
                                        '<br><br>' +
                                        'Credit card transaction number: ' + couponData.transaction.id +
                                        '<br><br>' +
                                        'DELIVERY OPTION' +
                                        '<br><br>' +
                                        ( couponData.delivery == 'mail' ? 'WILL BE DELIVERED BY USPS MAIL IN 3-5 BUSINESS DAYS' : '' ) +
                                        ( couponData.delivery == 'email' ? 'Delivered by email to ' + couponData.recipientEmail : '' ) +
                                        ( couponData.delivery == 'pickup' ? 'CALL 808.635.6957 TO ARRANGE A TIME FOR PICKUP. Our staff is often unavailable during games.' : '' ) +

                                        //Delivered by email to ' + couponData.recipientEmail
                                        '<br><br>' +
                                        'Amount charged: $' + ( couponData.transaction.amount / 100 ).toFixed(2) +
                                        '<br><br>' +
                                        'Thank you!' +
                                        '<br><br>' +
                                        '---' +
                                        '<br><br>' +
                                        'Kauai Escape Room' +
                                        '<br>' +
                                        '4353 Rice Street, Suite #1' +
                                        '<br>' +
                                        'Lihue, HI 96766' +
                                        '<br>' +
                                        'escaperoomkauai.com' +
                                        '<br>' +
                                        'info@escaperoomkauai.com' +
                                        '<br>' +
                                        '808.635.6957' +
                                        '</div>' +
                                        '</div>';


                                    var bodyGift = '<div style="background-color: #ddd; padding: 30px;">' +
                                        '<div style="padding: 0px; width: 120px; margin: 0 auto; ">' +
                                        '<img src="https://www.escaperoomkauai.com/images/social-banner-logo.png" width="120" height="120">' +
                                        '</div>' +
                                        '<br><br>' +
                                        '<div style="background-color: #fff; padding: 30px; max-width: 380px; margin: 0 auto; ">' +
                                        'KAUAI ESCAPE ROOM - GIFT CARD FROM ' + couponData.sender + '</b>' +
                                        '<br><br>' +
                                        couponData.sender + ' just gave you a $' + parseFloat(couponData.discount).toFixed(2) + ' gift card!' +
                                        '<br><br>' +
                                        'HOW TO REDEEM THIS GIFT CARD' +
                                        '<br><br>' +
                                        'Gift card amount: $' + parseFloat(couponData.discount).toFixed(2) +
                                        '<br><br>' +
                                        '1. Go to escaperoomkauai.com and choose any game.' +
                                        '<br><br>' +
                                        '2. Enter coupon code ' + couponData.coupon + ' at checkout' +
                                        '<br><br>' +
                                        'See you soon!' +
                                        '<br><br>' +
                                        '---' +
                                        '<br><br>' +
                                        'Kauai Escape Room' +
                                        '<br>' +
                                        '4353 Rice Street, Suite #1' +
                                        '<br>' +
                                        'Lihue, HI 96766' +
                                        '<br>' +
                                        'escaperoomkauai.com' +
                                        '<br>' +
                                        'info@escaperoomkauai.com' +
                                        '<br>' +
                                        '808.635.6957' +
                                        '</div>' +
                                        '</div>';

                                    // Call 'sendEmail' method
                                    if (couponData.delivery == 'email') {
                                        Meteor.call(
                                            'sendEmail',                                                        // Method
                                            couponData.recipientEmail,                                                  // Customer email
                                            '"Kauai Escape Room" ' + Meteor.settings.public.smtp.email,         // Our name & email
                                            couponData.sender + ' thinks you are smart enough for this gift!',      // Subject
                                            bodyGift,                     // Message body
                                            function (error, result) {                                          // Callback

                                                // Handle errors as needed
                                                // We don't handle successful responses from sendEmail; should we?
                                                // TODO: decide what to do with successful responses
                                                if (error) {
                                                    throw new Meteor.Error('[Bolt][Reservation][sendConfirmationEmail] Error', 'Error while sending booking confirmation. ||| Error message: ' + error.message + ' ||| Error object: ' + JSON.stringify(error));
                                                }
                                            }
                                        );
                                    }

                                    // Call 'sendEmail' method
                                    Meteor.call(
                                        'sendEmail',                                                        // Method
                                        couponData.senderEmail,                                                  // Customer email
                                        '"Kauai Escape Room" ' + Meteor.settings.public.smtp.email,         // Our name & email
                                        'Gift card purchase confirmation - coupon code ' + couponData.coupon,      // Subject
                                        bodyConfirmation,                     // Message body
                                        function (error, result) {                                          // Callback

                                            // Handle errors as needed
                                            // We don't handle successful responses from sendEmail; should we?
                                            // TODO: decide what to do with successful responses
                                            if (error) {
                                                throw new Meteor.Error('[Bolt][Reservation][sendConfirmationEmail] Error', 'Error while sending booking confirmation. ||| Error message: ' + error.message + ' ||| Error object: ' + JSON.stringify(error));
                                            }
                                        }
                                    );


                                    // Configure the Twilio client
                                    var SMSString = "New Gift Card Purchase - $" + parseFloat(couponData.discount).toFixed(2) + " - From " + couponData.sender + " to " + couponData.recipient + " - " +
                                        ( couponData.delivery == 'mail' ? 'TO BE DELIVERED BY USPS MAIL' : '' ) +
                                        ( couponData.delivery == 'email' ? 'Delivered by email' : '' ) +
                                        ( couponData.delivery == 'pickup' ? 'WILL CALL FOR PICKUP' : '' );

                                    Meteor.call('sendAdminNotificationSMS', SMSString, function (error, response) {
                                        if (error) {
                                            // console.log( error );
                                            new Meteor.Error("[roomDetails][submitOrder][sendSMS] Error", error.message);
                                        } else {
                                            // console.log( response );
                                        }

                                    });


                                    Notifications.success('Coupon Created', 'Coupon ' + couponData.coupon + ' created!')
                                    Router.go('giftCardPurchaseConfirmed', {_id: result});

                                    // INSERT FAILED
                                }else{

                                    // console.log( 'INSERT FAILED' );

                                }

                                Bolt.hideLoadingAnimation();

                                // NO ERROR / NO RESPONSE FROM CHARGE CARD CALL????
                            } else {
                                Notifications.error('Payment Processing Error: ' + error.message, 'Sorry. We could not process your card. Please try again or call us at 808.635.6957');
                                Bolt.hideLoadingAnimation();
                            }
                        });

                    //ERROR
                }else{

                    // console.log( "STRIPE ERROR. STATUS CODE: ", status );
                    Notifications.error('Payment Processing Error: ' + status, 'Sorry. We could not process your card. Please try again or call us at 808.635.6957');
                    Bolt.hideLoadingAnimation();


                }

            });

        }else{

            Notifications.error("All fields are required.");

        }

    }

});

/**
 * =============================================================
 * TEMPLATE RENDERED
 * =============================================================
 */
Template.giftCards.onRendered(function(){

    // LOG ROOM DETAILS VIEW
    fbq('track', 'ViewContent', {
        content_ids: 'gift-card',
        product: 'gift-card'
    });

});


/**
 * =============================================================
 * TEMPLATE DESTROYED
 * =============================================================
 */
Template.giftCards.onDestroyed(function(){});

/**
 * =============================================================
 * TEMPLATE EVENTS
 * =============================================================
 */
Template.giftCards.events({
    'keyup [hook="update-amount"]': function(evt,tmpl){

        tmpl.updateCheckoutValues();

    },
    'submit form': function(evt,tmpl){

        evt.preventDefault();
        tmpl.submitOrder();

    },
    'change [hook="change-delivery"]': function(evt,tmpl){

        tmpl.updateCheckoutValues();

        var deliveryOption = evt.currentTarget.value;

        if( deliveryOption == 'email' ){

            $('[hook="address-section"]').addClass('hidden');
            $('[hook="email-section"]').removeClass('hidden');

        }else if( deliveryOption == 'mail' ){

            $('[hook="email-section"]').addClass('hidden');
            $('[hook="address-section"]').removeClass('hidden');

        }else{

            $('[hook="email-section"]').addClass('hidden');
            $('[hook="address-section"]').addClass('hidden');

        }
    }
});


/**
 * =============================================================
 * TEMPLATE HELPERS
 * =============================================================
 */
Template.giftCards.helpers({

    years: function(){
        var currentYear = new Date().getFullYear();
        var years = [];
        for( var x = currentYear; x < currentYear + 10; x++ ){
            years.push( x );
        }
        return years;
    },

    settings: function(){
        return Bolt.Collections.Settings.findOne({settingType: 'global'});
    },

    checkoutData: function(){
        return Session.get( 'checkoutData' );
    }

});
