/**
 * METHOD: chargeCard
 * TAKE MONEY FROM PEOPLE!!!
 */
Meteor.methods({

    // Method
    'chargeCard': function(stripeToken,totalInCents) {

        // STUBBING: On the client, do nothing
        if( Meteor.isClient ){
            // console.log( 'stubbing...', stripeToken, total );
        }

        // On the server, process card asynchronously
        if( Meteor.isServer ) {
            Stripe = StripeAPI(Meteor.settings.private.stripe.secretKey);

            // Process card; asynchronous
            var charge = Meteor.wrapAsync( Stripe.charges.create, Stripe.charges );
            var chargeResult = charge({
                amount: totalInCents,
                currency: 'usd',
                source: stripeToken
            });

            // Return result to be handled by client
            return chargeResult;
        }
    }
});