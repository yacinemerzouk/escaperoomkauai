/**
 * NAMESPACE FILE
 * This is where we set our global variables
 * We also set their prefixes/namespace to avoid conflicts with 3rd party libraries
 */


EscapeRoom = {};
EscapeRoom.Collections = {};
EscapeRoom.Collections.Rooms = new Mongo.Collection('rooms');
EscapeRoom.Collections.Reservations = new Mongo.Collection('reservations');

/**
 * RESERVATIONS COLLECTION RULES
 */
EscapeRoom.Collections.Reservations.allow({
    insert: function( userId, doc ){
        return doc.transaction.status === 'succeeded' ? true : false;
    }
});


/**
 * CLIENT-ONLY FUNCTIONS
 */
if( Meteor.isClient ) {

    /**
     * FUNCTION EscapeRoom.getConfirmationEmailBody
     *
     * Generate HTML for confirmation email
     *
     * @param resId : String : a reservation _id
     * @returns String : the email body HTML
     */
    EscapeRoom.getConfirmationEmailBody = function( resId ){
        var body = 'KAUAI ESCAPE ROOM' +
            '<br><br>' +
            '<b>ONLINE RESERVATION CONFIRMATION</b>' +
            '<br><br>' +
            '<a href="https://www.escaperoomkauai.com/confirmation/'+resId+'">Click here for reservation details</a>' +
            '<br><br><br>' +
            '<b>CHECK-IN</b>' +
            '<br><br>' +
            'Please arrive 10 minutes in advance.' +
            '<br><br><br>' +
            '<b>PARKING</b>' +
            '<br><br>' +
            'Parking is available behind our building. You might also be able to park on Rice street depending on the time and day of the week. It may take you a few minutes to find parking, especially on weekdays before 6pm, so please plan accordingly.' +
            '<br><br>' +
            'PLEASE CALL 808.635.6957 IF YOU HAVE ANY QUESTIONS OR NEED HELP WITH DIRECTION.' +
            '<br><br><br>' +
            '<b>Location and directions:</b>' +
            '<br><br>' +
            '<a href="https://goo.gl/maps/VeL2UA3BNEo">Click here to view on Google Maps</a> or go to https://goo.gl/maps/VeL2UA3BNEo' +
            '<br><br>' +
            'See you soon!' +
            '<br><br>' +
            '---' +
            '<br><br>' +
            'Kauai Escape Room' +
            '<br>' +
            '4353 Rice Street, Suite #3' +
            '<br>' +
            'Lihue, HI 96766' +
            '<br>' +
            'escaperoomkauai.com' +
            '<br>' +
            'info@escaperoomkauai.com' +
            '<br>' +
            '808.635.6957'
            ;
        return body;
    }

    /**
     * FUNCTION EscapeRoom.canClose
     *
     * Checks whether to allow a room to be closed
     * Rooms can be close if the reservation is the first for a time slot and if the number of players requested
     * is less than the max nb players for the room
     *
     * @param roomId
     * @param date
     * @param time
     * @returns {boolean}
     */
    EscapeRoom.canClose = function (roomId, date, time) {

        // Get room data
        var room = EscapeRoom.Collections.Rooms.findOne(roomId);

        // Get nb of players being booked
        var selectedNbPlayers = Session.get( 'selectedNbPlayers' );

        // Get all existing reservations for requested time slot
        var reservations = EscapeRoom.Collections.Reservations.find({
            roomId: roomId,
            time: time,
            date: date
        }).fetch();

        // Calculate how many spots are available before current reservation request
        var spotsLeft = EscapeRoom.spotsLeft();

        // Can the room be closed?
        // Rooms can be close if the reservation is the first for a time
        // slot and if the number of players requested
        // is less than the max nb players for the room
        return spotsLeft == room.maxPlayers && !(room.maxPlayers == selectedNbPlayers);

    }

    /**
     * FUNCTION: EscapeRoom.spotsLeft
     *
     * Calculate how many spots are available for a time slot
     *
     * @param roomId
     * @param date
     * @param time
     * @returns {number}
     */
    EscapeRoom.spotsLeft = function (roomId, date, time) {

        // Get room data
        var room = EscapeRoom.Collections.Rooms.findOne(roomId);

        // Get all existing reservations for requested time slot
        var reservations = EscapeRoom.Collections.Reservations.find({
            roomId: roomId,
            time: time,
            date: date
        }).fetch();


        // Calculate how many spots are available before current reservation request
        var isClosed = false;
        var spotsLeft = room.maxPlayers;
        if( reservations && reservations.length > 0 ){
            _.each( reservations, function( reservation ){
                if( reservation.closeRoom ){
                    isClosed = true;
                }
                spotsLeft = spotsLeft - reservation.nbPlayers;
            });
        }
        if( isClosed ){
            spotsLeft = 0;
        }

        // All done. Return number of spots available
        return spotsLeft;

    }

}


/**
 * SERVER-ONLY FUNCTIONS
 */
if (Meteor.isServer) {

    // On startup
    Meteor.startup(function () {

        // Add all static pages to sitemap -- see gadicohen:sitemaps docs
        sitemaps.add('/pages.xml', function () {

            // Create array of page data
            var out = [];

            // Loop over routes
            _.each(Router.routes, function (route) {

                // If route has sitemap: true param
                if (route && route.options && route.options.sitemap) {

                    // Add the route as a page in sitemap
                    out.push({
                        page: route.path(),
                        lastmod: new Date(),
                        changefreq: route.options.changefreq ? route.options.changefreq : 'monthly',
                        priority: route.options.priority ? route.options.priority : '0.5'
                    });

                }

            });

            // Spit it out! Return array of sitemap pages
            return out;

        });


        // Add all dynamic room-info pages to sitemap -- see gadicohen:sitemaps docs
        sitemaps.add('/rooms.xml', function () {

            // Create array of page data
            var out = [];

            // Get all rooms
            var rooms = EscapeRoom.Collections.Rooms.find().fetch();

            // If we found at least 1 room
            if (rooms && rooms.length >= 1) {

                // Loop over rooms
                _.each(rooms, function (room) {

                    // Add room data as a page in sitemap
                    out.push({
                        page: 'room/' + room.slug,
                        lastmod: new Date(),
                        changefreq: 'monthly',
                        priority: '0.9'
                    });

                });
            }

            // All done; return array of sitemap pages
            return out;

        });

    });

}