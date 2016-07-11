/**
 * METHOD: chargeCard
 * TAKE MONEY FROM PEOPLE!!!
 */
Meteor.methods({

    // Method
    'chargeCard': function(stripeToken,total) {

        // STUBBING: On the client, do nothing
        // TODO: UI stuff to let user know stuff is getting processed??
        if( Meteor.isClient ){
            console.log( 'stubbing...', stripeToken, total );
        }

        // On the server, process card asynchronously
        if( Meteor.isServer ) {
            // TODO: set API keys from settings
            Stripe = StripeAPI('sk_test_ngE14PMlvYJunAPkrJBq5VdC');

            // Process card; asynchronous
            var charge = Meteor.wrapAsync( Stripe.charges.create, Stripe.charges );
            var chargeResult = charge({
                amount: total,
                currency: 'usd',
                source: stripeToken
            });

            // Return result to be handled by client
            return chargeResult;
        }
    }
});