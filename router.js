








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
        // console.log( games.fetch() );
        return {
            date: this.params.date,
            games: games
        }
    }
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
 * Coupons
 */
Router.route('/admin/coupons/create', {
    name: 'adminCouponsCreate',
    layoutTemplate: 'layoutAdmin',
    waitOn: function(){
        return [
            Meteor.subscribe('coupons')
        ]
    }
});

/**
 * Coupons
 */
Router.route('/admin/coupons/update', {
    name: 'adminCouponsUpdate',
    layoutTemplate: 'layoutAdmin',
    waitOn: function(){
        return [
            Meteor.subscribe('coupons')
        ]
    }
});
















/**
 * Room details by date
 */
// Router.route('/room/:slug/:date', {
//     name: 'roomByDate',
//     waitOn: function(){
//         return [
//             Meteor.subscribe( 'room', this.params.slug )
//         ]
//     },
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



