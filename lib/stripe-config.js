/**
 * Strip config on client
 */
if( Meteor.isClient ) {
    Meteor.startup(function () {
        Stripe.setPublishableKey(Meteor.settings.public.stripe.publishableKey);
    });
}