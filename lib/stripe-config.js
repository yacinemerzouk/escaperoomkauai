if( Meteor.isClient ) {
    Meteor.startup(function () {
        Stripe.setPublishableKey('pk_test_UJDnOhpfhyTXxsf4AdvOFKOu');
    });
}