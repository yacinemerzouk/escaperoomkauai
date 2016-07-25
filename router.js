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
    notFoundTemplate: 'notFound',
    waitOn: function(){
        return [
            Meteor.subscribe('rooms'),
            Meteor.subscribe('reservations')
        ]
    }
});

/**
 * Home
 */
Router.route('/', {
    name: 'home',
    sitemap: true,
    changefreq: 'daily',
    priority: '1.0',
    ironMeta: true,
    meta: function(){
        var title = 'Kauai Escape Room - Escape Games, Puzzle Rooms';
        var description = 'Kauai Escape Room offers live action escape games and puzzle rooms. We are located on Rice Street in Lihue, Kauai, Hawaii.';
        var image = 'https://www.escaperoomkauai.com/images/social-banner-logo.png';
        return {
            title: title,
            description: description,
            keywords: 'kauai, escape room, escape game, puzzle room',
            canonical: 'https://www.escaperoomkauai.com',
            "og:title": title,
            "og:type": 'website',
            "og:url": 'https://www.escaperoomkauai.com',
            "og:description": description,
            "og:site_name": 'Kauai Escape Room',
            "og:image": image,
            "og:image:width": '1200',
            "og:image:height": '630',
            "twitter:card": 'summary_large_image',
            "twitter:site": '@kauaiescaperoom',
            "twitter:creator": '@kauaiescaperoom',
            "twitter:title": title,
            "twitter:description": description,
            "twitter:image": image
        }
    }
});

/**
 * ROOMS
 */
Router.route('/rooms', {
    name: 'rooms',
    sitemap: true,
    changefreq: 'monthly',
    priority: '0.9',
    ironMeta: true,
    meta: function(){
        var title = 'Our Escape Rooms - Kauai Escape Room - Escape Games, Puzzle Rooms';
        var description = "Our escape rooms: the missing scientist, the lost Elvis record, Pele's tiki lounge, and our mobile escape room.";
        var image = 'https://www.escaperoomkauai.com/images/social-banner-logo.png';
        return {
            title: title,
            description: description,
            keywords: 'kauai, escape room, escape game, puzzle room',
            canonical: 'https://www.escaperoomkauai.com/rooms',
            "og:title": title,
            "og:type": 'website',
            "og:url": 'https://www.escaperoomkauai.com/rooms',
            "og:description": description,
            "og:site_name": 'Kauai Escape Room',
            "og:image": image,
            "og:image:width": '1200',
            "og:image:height": '630',
            "twitter:card": 'summary_large_image',
            "twitter:site": '@kauaiescaperoom',
            "twitter:creator": '@kauaiescaperoom',
            "twitter:title": title,
            "twitter:description": description,
            "twitter:image": image
        }
    }
});

/**
 * FAQ
 */
Router.route('/faq', {
    name: 'faq',
    sitemap: true,
    changefreq: 'monthly',
    priority: '0.5',
    ironMeta: true,
    meta: function() {
        var title = 'FAQ - Frequently Asked Questions - Kauai Escape Room';
        var description = 'First time players always have a lot of questions. We understand. Here are the most common ones. Feel free to call us for more info.';
        var image = 'https://www.escaperoomkauai.com/images/social-banner-logo.png';
        return {
            title: title,
            description: description,
            keywords: 'kauai, escape room, escape game, puzzle room',
            canonical: 'https://www.escaperoomkauai.com/faq',
            "og:title": title,
            "og:type": 'website',
            "og:url": 'https://www.escaperoomkauai.com/faq',
            "og:description": description,
            "og:site_name": 'Kauai Escape Room',
            "og:image": image,
            "og:image:width": '1200',
            "og:image:height": '630',
            "twitter:card": 'summary_large_image',
            "twitter:site": '@kauaiescaperoom',
            "twitter:creator": '@kauaiescaperoom',
            "twitter:title": title,
            "twitter:description": description,
            "twitter:image": image
        }
    }
});

/**
 * ABOUT
 */
Router.route('/about', {
    name: 'about',
    sitemap: true,
    changefreq: 'monthly',
    priority: '0.5',
    ironMeta: true,
    meta: function() {
        var title = 'About Us - Kauai Escape Room - Escape Games, Puzzle Rooms';
        var description = 'We are a couple from Kapaa. He is a published game designer and storytelling enthusiast. She is an educator with a creative mind. We have been making our own escape room games since 2015.';
        var image = 'https://www.escaperoomkauai.com/images/social-banner-logo.png';
        return {
            title: title,
            description: description,
            keywords: 'kauai, escape room, escape game, puzzle room',
            canonical: 'https://www.escaperoomkauai.com/about',
            "og:title": title,
            "og:type": 'website',
            "og:url": 'https://www.escaperoomkauai.com/about',
            "og:description": description,
            "og:site_name": 'Kauai Escape Room',
            "og:image": image,
            "og:image:width": '1200',
            "og:image:height": '630',
            "twitter:card": 'summary_large_image',
            "twitter:site": '@kauaiescaperoom',
            "twitter:creator": '@kauaiescaperoom',
            "twitter:title": title,
            "twitter:description": description,
            "twitter:image": image
        }
    }

});

/**
 * Contact
 */
Router.route('/contact', {
    name: 'contact',
    sitemap: true,
    changefreq: 'monthly',
    priority: '0.5',
    ironMeta: true,
    meta: function() {
        var title = 'Contact Us - Kauai Escape Room - Escape Games, Puzzle Rooms';
        var description = 'Email us at info@escaperoomkauai.com. You can also call us at 1.808.635.6957 to ask questions or book over the phone. Of course you can also book online.';
        var image = 'https://www.escaperoomkauai.com/images/social-banner-logo.png';
        return {
            title: title,
            description: description,
            keywords: 'kauai, escape room, escape game, puzzle room',
            canonical: 'https://www.escaperoomkauai.com/contact',
            "og:title": title,
            "og:type": 'website',
            "og:url": 'https://www.escaperoomkauai.com/contact',
            "og:description": description,
            "og:site_name": 'Kauai Escape Room',
            "og:image": image,
            "og:image:width": '1200',
            "og:image:height": '630',
            "twitter:card": 'summary_large_image',
            "twitter:site": '@kauaiescaperoom',
            "twitter:creator": '@kauaiescaperoom',
            "twitter:title": title,
            "twitter:description": description,
            "twitter:image": image
        }
    }

});

/**
 * Directions
 */
Router.route('/directions', {
    name: 'directions',
    sitemap: true,
    changefreq: 'monthly',
    priority: '0.1',
    ironMeta: true,
    meta: function() {
        var title = 'Directions - Kauai Escape Room - Escape Games, Puzzle Rooms';
        var description = 'We are located at 4353 Rice Street, Unit #1. Reserve online before showing up.';
        var image = 'https://www.escaperoomkauai.com/images/social-banner-logo.png';
        return {
            title: title,
            description: description,
            keywords: 'kauai, escape room, escape game, puzzle room',
            canonical: 'https://www.escaperoomkauai.com/directions',
            "og:title": title,
            "og:type": 'website',
            "og:url": 'https://www.escaperoomkauai.com/directions',
            "og:description": description,
            "og:site_name": 'Kauai Escape Room',
            "og:image": image,
            "og:image:width": '1200',
            "og:image:height": '630',
            "twitter:card": 'summary_large_image',
            "twitter:site": '@kauaiescaperoom',
            "twitter:creator": '@kauaiescaperoom',
            "twitter:title": title,
            "twitter:description": description,
            "twitter:image": image
        }
    }

});

/**
 * Reservations - Admin page
 */
Router.route('/reservations', {
    name: 'reservations'
});

/**
 * Confirmation
 */
Router.route('/confirmation/:_id', {
    name: 'confirmation',
    layoutTemplate: 'layoutConfirmation',
    data: function(){
        return EscapeRoom.Collections.Reservations.findOne(this.params._id);
    }
});

/**
 * Room details
 */
Router.route('/room/:slug', {
    name: 'room',
    ironMeta: true,
    meta: function(){
        var room =  EscapeRoom.Collections.Rooms.findOne({slug:this.params.slug});
        var title = room.title + ' - Kauai Escape Room';
        var image = 'https://www.escaperoomkauai.com' + room.image;
        return {
            title: title,
            description: room.description,
            keywords: 'kauai, escape room, escape game, puzzle room',
            canonical: 'https://www.escaperoomkauai.com/room/'+room.slug,
            "og:title": title,
            "og:type": 'website',
            "og:url": 'https://www.escaperoomkauai.com/room/'+room.slug,
            "og:description": room.description,
            "og:site_name": 'Kauai Escape Room',
            "og:image": image,
            "og:image:width": '1200',
            "og:image:height": '630',
            "twitter:card": 'summary_large_image',
            "twitter:site": '@kauaiescaperoom',
            "twitter:creator": '@kauaiescaperoom',
            "twitter:title": title,
            "twitter:description": room.description,
            "twitter:image": image
        }
    },
    data: function(){
        var room =  EscapeRoom.Collections.Rooms.findOne({slug:this.params.slug});
        return room;
    }
});

/**
 * After action hooks
 */
Router.onAfterAction(function(){

    // Only this routine on client
    if( Meteor.isClient ) {

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
        var metaData = this.meta();

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