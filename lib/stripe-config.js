/**
 * Strip config on client
 * TODO: move API keys to settings files
 */
if( Meteor.isClient ) {
    Meteor.startup(function () {
        Stripe.setPublishableKey('pk_test_UJDnOhpfhyTXxsf4AdvOFKOu');
    });
}