Meteor.methods({
    'chargeCard': function(stripeToken,total) {
        if( Meteor.isClient ){
            console.log( 'stubbing...', stripeToken, total );
        }
        if( Meteor.isServer ) {
            Stripe = StripeAPI('sk_test_ngE14PMlvYJunAPkrJBq5VdC');
            var charge = Meteor.wrapAsync( Stripe.charges.create, Stripe.charges );
            var chargeResult = charge({
                amount: total,
                currency: 'usd',
                source: stripeToken
            });
            return chargeResult;
        }
    }
});