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
 * Home
 */
Router.route('/', {
    name: 'home',
    sitemap: true,
    changefreq: 'daily',
    priority: '1.0',
    // waitOn: function(){
    //     return Meteor.subscribe( 'rooms' );
    // },
    ironMeta: true,
    data: function(){
        return Bolt.Collections.Settings.findOne({settingType: 'global'});
    },
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
    // waitOn: function(){
    //     return [
    //         Meteor.subscribe( 'rooms' ),
    //         Meteor.subscribe( 'games' )
    //     ]
    // },
    data: function(){
        return Bolt.Collections.Settings.findOne({settingType: 'global'});
    },
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
 * ROOMS
 */
Router.route('/rooms/calendar', {
    name: 'roomsCalendar',
    sitemap: true,
    changefreq: 'monthly',
    priority: '0.9',
    waitOn: function(){
        var date = Session.get('calendarDay') || Epoch.dateObjectToDateString(new Date());
        return Meteor.subscribe('rooms');
    },
    data: function(){
        return Bolt.Collections.Settings.findOne({settingType: 'global'});
    },
    ironMeta: true,
    meta: function(){
        var title = 'Availability Calendar - Kauai Escape Room - Escape Games, Puzzle Rooms';
        var description = "The complete availability calendar for our escape rooms: the missing scientist, the lost Elvis record, Pele's tiki lounge, and our mobile escape room.";
        var image = 'https://www.escaperoomkauai.com/images/social-banner-logo.png';
        return {
            title: title,
            description: description,
            keywords: 'kauai, escape room, escape game, puzzle room',
            canonical: 'https://www.escaperoomkauai.com/rooms/calendar',
            "og:title": title,
            "og:type": 'website',
            "og:url": 'https://www.escaperoomkauai.com/rooms/calendar',
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
    data: function(){
        return Bolt.Collections.Settings.findOne({settingType: 'global'});
    },
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
    data: function(){
        return Bolt.Collections.Settings.findOne({settingType: 'global'});
    },
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
    data: function(){
        return Bolt.Collections.Settings.findOne({settingType: 'global'});
    },
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
    data: function(){
        return Bolt.Collections.Settings.findOne({settingType: 'global'});
    },
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
 * Admin Dashboard
 */
Router.route('/admin/dashboard', {
    name: 'adminDashboard',
    layoutTemplate: 'layoutAdmin'
});

/**
 * Admin Rooms (List)
 */
Router.route('/admin/rooms', {
    name: 'adminRooms',
    layoutTemplate: 'layoutAdmin',
    waitOn: function(){
        return [
            Meteor.subscribe('rooms')
        ]
    }
});

/**
 * Admin Rooms (Create)
 */
Router.route('/admin/create-room', {
    name: 'createRoom',
    waitOn: function() {
        return [
            Meteor.subscribe('rooms')
        ]
    }
});

/**
 * Admin Rooms (Create)
 */
Router.route('/admin/update-room/:_id', {
    name: 'updateRoom',
    waitOn: function(){
        return [
            Meteor.subscribe('rooms')
        ]
    },
    data: function(){
        return Bolt.Collections.Rooms.findOne(this.params._id);
    }
});


/**
 * Admin Settings
 */
Router.route('/admin/settings', {
    name: 'adminSettings',
    layoutTemplate: 'layoutAdmin',
    data: function(){
        return Bolt.Collections.Settings.findOne({settingType: 'global'});
    }
});

/**
 * Reservations - Admin page
 */
Router.route('/reservations', {
    name: 'reservations',
    onBeforeAction: function(){
        Router.go('adminGamesCalendar');
    }
});

/**
 * Create Reservations - Admin page
 */
Router.route('/admin/reservations/create', {
    name: 'reservationsCreate',
    layoutTemplate: 'layoutAdmin',
    waitOn: function(){
        return Meteor.subscribe('rooms');
    }
});

/**
 * Admin - Schedule
 */
Router.route('/admin/schedule', {
    name: 'adminSchedule',
    layoutTemplate: 'layoutAdmin',
    waitOn: function(){
        return [
            Meteor.subscribe('futureGames'),
            Meteor.subscribe('rooms')
        ]
    }
});

/**
 * Admin - Schedule - Date
 */
Router.route('/admin/schedule/:date', {
    name: 'adminScheduleDay',
    template: 'adminSchedule',
    layoutTemplate: 'layoutAdmin',
    waitOn: function(){
        return [
            Meteor.subscribe('rooms'),
            Meteor.subscribe('futureGames')
        ]
    },
    data: function(){
        var games = Bolt.Collections.Games.find();
        console.log( games.fetch() );
        return {
            date: this.params.date,
            games: games
        }
    }
});


/**
 * Test
 */
Router.route('/test', {
    name: 'layoutTest',
    layoutTemplate: 'layoutAdmin'
});

/**
 * Admin Calendar - Admin page
 */
Router.route('/admin/games/calendar', {
    name: 'adminGamesCalendar',
    layoutTemplate: 'layoutAdmin'
});

/**
 * Reservations - Admin page
 */
Router.route('/reservations/:date', {
    name: 'reservationsByDate',
    waitOn: function(){
        return [
            Meteor.subscribe('reservations', this.params.date),
            Meteor.subscribe('rooms'),
            Meteor.subscribe('games', this.params.date)
        ]
    },
    data: function(){
        return {
            date: this.params.date
        }
    }
});

/**
 * Coupons
 */
Router.route('/admin/coupons/list', {
    name: 'adminCouponsList',
    layoutTemplate: 'layoutAdmin',
    waitOn: function(){
        return [
            Meteor.subscribe('coupons')
        ]
    }
});


/**
 * Gift Cards
 */
Router.route('/gift-cards', {
    name: 'giftCards'
});

Router.route('/gift-cards/purchase-confirmed/:_id',{
    name: 'giftCardPurchaseConfirmed',
    layoutTemplate: 'layoutConfirmation',
    waitOn: function(){
        Meteor.subscribe( 'couponById', this.params._id )
    },
    data: function(){
        return Bolt.Collections.Coupons.findOne(this.params._id);
    }
})

/**
 * Waivers
 */
Router.route('/waiver', {
    name: 'waiver',
    layoutTemplate: 'layoutEmpty'
});

/**
 * Transactions - Admin page
 */
Router.route('/reports/transactions/list', {
    name: 'reportsTransactionsList',
    waitOn: function(){
        return [
            Meteor.subscribe('reservations'),
            Meteor.subscribe('rooms')
        ]
    }
});


/**
 * Confirmation
 */
Router.route('/confirmation/:_id', {
    name: 'confirmation',
    layoutTemplate: 'layoutConfirmation',
    waitOn: function(){
        return [
            Meteor.subscribe('reservation', this.params._id),
            Meteor.subscribe('rooms'),
            Meteor.subscribe('games')
        ]
    },
    data: function(){
        return {
            publicId: this.params._id
        }
    }
});



/**
 * Room details
 */
// Router.route('/room/:slug', {
//     name: 'room',
//     waitOn: function(){
//         return [
//             Meteor.subscribe( 'room', this.params.slug )
//         ]
//     },
//     sitemap: true,
//     changefreq: 'monthly',
//     priority: '0.9',
//     ironMeta: true,
//     meta: function(){
//         var room =  Bolt.Collections.Rooms.findOne({slug:this.params.slug});
//         var title, image, description, slug;
//         if( room ){
//             title = room.title + ' - Kauai Escape Room';
//             image = 'https://www.escaperoomkauai.com' + room.image;
//             description = room.description;
//         }else{
//             title = 'Kauai Escape Room';
//             image = 'https://www.escaperoomkauai.com/images/social-banner-logo.png';
//             description = 'An escape game by Kauai Escape Room';
//         }
//         return {
//             title: title,
//             description: description,
//             keywords: 'kauai, escape room, escape game, puzzle room',
//             canonical: 'https://www.escaperoomkauai.com/room/'+this.params.slug,
//             "og:title": title,
//             "og:type": 'website',
//             "og:url": 'https://www.escaperoomkauai.com/room/'+this.params.slug,
//             "og:description": description,
//             "og:site_name": 'Kauai Escape Room',
//             "og:image": image,
//             "og:image:width": '1200',
//             "og:image:height": '630',
//             "twitter:card": 'summary_large_image',
//             "twitter:site": '@kauaiescaperoom',
//             "twitter:creator": '@kauaiescaperoom',
//             "twitter:title": title,
//             "twitter:description": description,
//             "twitter:image": image
//         }
//     },
//     data: function(){
//         var room =  Bolt.Collections.Rooms.findOne({slug:this.params.slug});
//         return room;
//     }
// });

/**
 * Room details
 */
Router.route('/room/:slug', {
    name: 'room',
    waitOn: function(){
        return [
            Meteor.subscribe( 'room', this.params.slug )
        ]
    },
    sitemap: true,
    changefreq: 'monthly',
    priority: '0.9',
    ironMeta: true,
    meta: function(){
        var room =  Bolt.Collections.Rooms.findOne({slug:this.params.slug});
        var title, image, description, slug;
        if( room ){
            title = room.title + ' - Kauai Escape Room';
            image = 'https://www.escaperoomkauai.com' + room.image;
            description = room.description;
        }else{
            title = 'Kauai Escape Room';
            image = 'https://www.escaperoomkauai.com/images/social-banner-logo.png';
            description = 'An escape game by Kauai Escape Room';
        }
        return {
            title: title,
            description: description,
            keywords: 'kauai, escape room, escape game, puzzle room',
            canonical: 'https://www.escaperoomkauai.com/room/'+this.params.slug,
            "og:title": title,
            "og:type": 'website',
            "og:url": 'https://www.escaperoomkauai.com/room/'+this.params.slug,
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
    },
    data: function(){
        var room =  Bolt.Collections.Rooms.findOne({slug:this.params.slug});
        var settings = Bolt.Collections.Settings.findOne({settingType: 'global'});
        return {
            room: room,
            settings: settings
        };
    }
});

/**
 * Room details by date
 */
Router.route('/room/:slug/:date', {
    name: 'roomByDate',
    waitOn: function(){
        return [
            Meteor.subscribe( 'room', this.params.slug )
        ]
    },
    ironMeta: true,
    meta: function(){
        var room =  Bolt.Collections.Rooms.findOne({slug:this.params.slug});
        var title, image, description, slug;
        if( room ){
            title = room.title + ' - Kauai Escape Room';
            image = 'https://www.escaperoomkauai.com' + room.image;
            description = room.description;
        }else{
            title = 'Kauai Escape Room';
            image = 'https://www.escaperoomkauai.com/images/social-banner-logo.png';
            description = 'An escape game by Kauai Escape Room';
        }
        return {
            title: title,
            description: description,
            keywords: 'kauai, escape room, escape game, puzzle room',
            canonical: 'https://www.escaperoomkauai.com/room/'+this.params.slug,
            "og:title": title,
            "og:type": 'website',
            "og:url": 'https://www.escaperoomkauai.com/room/'+this.params.slug,
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
    },
    data: function(){
        var room =  Bolt.Collections.Rooms.findOne({slug:this.params.slug});
        return room;
    }
});


/**
 * Game management
 */
Router.route('/game/play/:_id', {
    name: 'gamePlay',
    layoutTemplate: 'layoutAdmin',
    waitOn: function(){
        var game = new Bolt.Game(this.params._id);
        console.log( 'waiton...', game );
        return [
            Meteor.subscribe( 'game', this.params._id ),
            Meteor.subscribe( 'roomById', game.roomId )
        ]
    },
    data: function(){
        return {_id:this.params._id}
    }
    // data: function(){
    //     // var gameData = {
    //     //     date: this.params.date,
    //     //     time: this.params.time,
    //     //     roomId: this.params.roomId
    //     // };
    //     // var game = new Bolt.Game( gameData );
    //     // if( !game._id ){
    //     //     game.save();
    //     // }
    //     // if( ! gameData ){
    //     //     var gameId = Bolt.Collections.Games.insert({
    //     //         slug: 'mad-scientist',
    //     //         date: this.data.date,
    //     //         time: this.data.time
    //     //     });
    //     //     gameData = {
    //     //         _id: gameId,
    //     //         date: this.params.date,
    //     //         time: this.params.time
    //     //     }
    //     // }
    //     //var game = Bolt.Collections.Games.findOne( gameData );
    //     return gameData;
    // }
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