/**
 * METHOD: chargeCard
 * TAKE MONEY FROM PEOPLE!!!
 */
Meteor.methods({

    // Method
    'chargeCard': function(stripeToken,totalInCents,email) {



        // STUBBING: On the client, do nothing
        if( Meteor.isClient ){
            // console.log( 'stubbing...', stripeToken, total );
        }

        // On the server, process card asynchronously
        if( Meteor.isServer ) {
            Stripe = StripeAPI(Meteor.settings.private.stripe.secretKey);

            var customer = Bolt.Collections.Customers.findOne({email:email});

            if( email && email != "" && !customer ) {
                var createCustomer = Meteor.wrapAsync(Stripe.customers.create, Stripe.customers);
                customer = createCustomer({
                    source: stripeToken,
                    email: email
                });
                if( ! Bolt.Collections.Customers.insert({id:customer.id,email:customer.email}) ){
                    throw new Meteor.Error( '|Bolt|Method|chargeCard|', 'Could not insert customer' );
                }
            }

            // Process card; asynchronous
            var createCharge = Meteor.wrapAsync( Stripe.charges.create, Stripe.charges );
            var charge = createCharge({
                amount: totalInCents,
                currency: 'usd',
                customer: customer.id
            });

            // Return result to be handled by client
            return charge;

        }
    },

    // Method
    'holdCard': function(stripeToken,totalInCents, email) {



        // STUBBING: On the client, do nothing
        if( Meteor.isClient ){
            // console.log( 'stubbing...', stripeToken, total );
        }

        // On the server, process card asynchronously
        if( Meteor.isServer ) {
            Stripe = StripeAPI(Meteor.settings.private.stripe.secretKey);

            var customer = Bolt.Collections.Customers.findOne({email:email});
            if( email && email != "" && !customer ) {
                var createCustomer = Meteor.wrapAsync(Stripe.customers.create, Stripe.customers);
                customer = createCustomer({
                    source: stripeToken,
                    email: email
                });
                if( ! Bolt.Collections.Customers.insert({id:customer.id,email:customer.email}) ){
                    throw new Meteor.Error( '|Bolt|Method|chargeCard|', 'Could not insert customer' );
                }
            }

            // Add card to customer; asynchronous
            // var createCharge = Meteor.wrapAsync( Stripe.charges.create, Stripe.charges );
            // var charge = createCharge({
            //     amount: totalInCents,
            //     currency: 'usd',
            //     customer: customer.id
            // });

            // var createSource;
            //
            // var attachedSource = Stripe.customers.createSource(stripeCustomer.id, {
            //     source: "src_18eYalAHEMiOZZp1l9ZTjSU0"
            // });

            // Return result to be handled by client
            return customer;

        }
    }

});

/**
 * METHOD: refund
 * GIVE MONEY BACK TO PEOPLE!!!
 */
Meteor.methods({

    // Method
    'refund': function(transactionId,refundAmount) {

        // STUBBING: On the client, do nothing
        if( Meteor.isClient ){
            // console.log( 'stubbing...', stripeToken, total );
        }

        // On the server, process card asynchronously
        if( Meteor.isServer ) {

            Stripe = StripeAPI(Meteor.settings.private.stripe.secretKey);


            // Process card; asynchronous
            var createRefund = Meteor.wrapAsync( Stripe.refunds.create, Stripe.refunds );
            var refund = createRefund({
                charge: transactionId,
                amount: refundAmount
            });

            // Return result to be handled by client
            return refund;

        }
    }
});
