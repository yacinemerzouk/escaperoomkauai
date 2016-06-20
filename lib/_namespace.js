EscapeRoom = {};
EscapeRoom.Collections = {};

EscapeRoom.Collections.Rooms = new Mongo.Collection('rooms');
EscapeRoom.Collections.Reservations = new Mongo.Collection('reservations');

EscapeRoom.Collections.Reservations.allow({
    insert: function( userId, doc ){
        return doc.transaction.status === 'succeeded' ? true : false;
    }
})

if( Meteor.isClient ) {

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

    EscapeRoom.canClose = function (roomId, date, time) {

        var room = EscapeRoom.Collections.Rooms.findOne(roomId);

        var spotsLeft = room.maxPlayers;

        var selectedNbPlayers = Session.get( 'selectedNbPlayers' );

        var reservations = EscapeRoom.Collections.Reservations.find({
            roomId: roomId,
            time: time,
            date: date
        }).fetch();

        if( reservations && reservations.length > 0 ){
            _.each( reservations, function( reservation ){
                console.log('looping over', reservation);
                spotsLeft = spotsLeft - reservation.nbPlayers;
            });
        }

        return spotsLeft == room.maxPlayers && !(room.maxPlayers == selectedNbPlayers);

    }

    EscapeRoom.spotsLeft = function (roomId, date, time) {

        var room = EscapeRoom.Collections.Rooms.findOne(roomId);

        var spotsLeft = room.maxPlayers;

        var reservations = EscapeRoom.Collections.Reservations.find({
            roomId: roomId,
            time: time,
            date: date
        }).fetch();

        var isClosed = false;

        if( reservations && reservations.length > 0 ){
            _.each( reservations, function( reservation ){
                console.log('looping over', reservation);
                if( reservation.closeRoom ){
                    isClosed = true;
                }
                spotsLeft = spotsLeft - reservation.nbPlayers;
            });
        }

        if( isClosed ){
            spotsLeft = 0;
        }
        return spotsLeft;

    }



}

if (Meteor.isServer) {
    Meteor.startup(function () {

        sitemaps.add('/pages.xml', function () {
            var out = [];
            _.each(Router.routes, function (route) {

                if (route && route.options && route.options.sitemap) {
                    console.log( route.path() );
                    out.push({
                        page: route.path(),
                        lastmod: new Date(),
                        changefreq: route.options.changefreq ? route.options.changefreq : 'monthly',
                        priority: route.options.priority ? route.options.priority : '0.5'
                    });
                }

            });
            return out;
        });


        /**
         * ROOMS
         */
        sitemaps.add('/rooms.xml', function () {
            var out = [],
                rooms = EscapeRoom.Collections.Rooms.find().fetch();
            if (rooms && rooms.length > 0) {
                _.each(rooms, function (room) {

                        out.push({
                            page: 'room/' + room.slug,
                            lastmod: new Date(),
                            changefreq: 'monthly',
                            priority: '0.9'
                        });

                });
            }
            return out;
        });

    });
}