/**
 * ROUTES & ROUTER CONFIG
 *
 * Using iron:router, zendy:seo (for meta params), and gadicohen:sitemaps (for sitemap params)
 * zendy:seo is not a public package and isn't documented yet so be careful when changing meta stuff
 *
 * Also using okgrow:router-autoscroll to help transitions between routes (automatic, no code needed)
 *
 * Also using zendy:tuxedo, which uses iron router hook to add class names to the body tag  (automatic, no code needed)
 */


/**
 * Router options
 */
Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'layoutNotFound',
    waitOn: function(){
        return [
            Meteor.subscribe('settings'),
            Meteor.subscribe('gameMasters')
        ]
    }
    // waitOn: function(){
    //     return [
    //         Meteor.subscribe('rooms'),
    //         Meteor.subscribe('reservations'),
    //         Meteor.subscribe('coupons')
    //     ]
    // }
});


/**
 * After action hooks
 */
Router.onAfterAction(function(){

    // Only this routine on client
    if( Meteor.isClient ) {

        // Track FB Pageviews
        fbq('track', 'PageView');

        // Grab user-defined meta params from routes above
        var meta = this.lookupOption('meta');

        // Set the meta property of the route (as a function)
        if (typeof meta === 'function') {
            this.meta = _.bind(meta, this);
        }else if (typeof meta !== 'undefined') {
            this.meta = function () {
                return meta;
            }
        }

        // Grab whatever our new meta function returns
        if( this && this.meta ) {
            var metaData = this.meta();
        }
        // If we have metaData
        if( metaData ){

            // Remove any tag with value "zendy" in the "seo" attribute
            // This is used to update meta on route change
            $('[seo="zendy"]').remove();

            // Loop over meta data
            _.each(metaData, function(val, key){

                // Inject meta tags
                var injectMe;

                // TITLE
                if( key == 'title' ) {
                    document.title = val;

                    // CANONICAL
                }else if( key == 'canonical' ) {
                    $('head').append('<link rel="canonical" href="' + val +'" seo="zendy">');

                    // OTHER TAGS
                }else{

                    var idType = "name";

                    //Twitter likes the name attribute whilst standard dictates property
                    if (key.slice(0, 2) == "og" || key.slice(0, 2) == "fb") {
                        idType = "property";
                    }

                    // Append HTML
                    $('head').append('<meta ' + idType + '="' + key + '" content="' + val + '" seo="zendy"></meta>');

                }

            });

        }

    }

});