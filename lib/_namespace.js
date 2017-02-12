/**
 * NAMESPACE FILE
 * This is where we set our global variables
 * We also set their prefixes/namespace to avoid conflicts with 3rd party libraries
 */


Bolt = {};
Bolt.Collections = {};
Bolt.Collections.Rooms = new Mongo.Collection('rooms',{idGeneration:'STRING'});
Bolt.Collections.Reservations = new Mongo.Collection('reservations',{idGeneration:'STRING'});
Bolt.Collections.Coupons = new Mongo.Collection('coupons',{idGeneration:'STRING'});
Bolt.Collections.Games = new Mongo.Collection('games',{idGeneration:'STRING'});
Bolt.Collections.Settings = new Mongo.Collection('settings',{idGeneration:'STRING'});
Bolt.Collections.Customers = new Mongo.Collection('customers',{idGeneration:'STRING'});


/**
 * Bolt App
 */
Bolt.showLoadingAnimation = function(){
    if( Meteor.isClient ){
        $('[hook="loading-animation-toggle"]').show();
    }
}
Bolt.hideLoadingAnimation = function(){
    if( Meteor.isClient ){
        $('[hook="loading-animation-toggle"]').hide();
    }
}

/**
 * RESERVATIONS COLLECTION RULES
 */
Bolt.Collections.Reservations.allow({
    insert: function( userId, doc ){
        if( userId && doc.blocked == true ){
            return true;
        }else if( doc.transaction.status === 'succeeded' || doc.transaction.amount == 0 ){
            return true;
        }else{
            return false;
        }
    },
    remove: function( userId, doc ){
        return userId ? true : false;
    },
    update: function( userId, doc ){
        return userId ? true : false;
    }
});

/**
 * COUPONS COLLECTION RULES
 */
Bolt.Collections.Coupons.allow({
    insert: function( userId, doc ){
        return userId || ( doc.coupon.length == 9 && doc.coupon.indexOf('K') === 0 ) ? true : false;
    },
    update: function( userId, doc ){
        return userId || doc._id ? true : false;
    },
    remove: function( userId, doc ){
        return userId ? true : false;
    }
});

/**
 * GAMES COLLECTION RULES
 */
Bolt.Collections.Games.allow({
    insert: function( userId, doc ){
        // return userId ? true : false;
        return true;
    },
    update: function( userId, doc ){
        // return userId || doc._id ? true : false;
        return true;
    },
    remove: function( userId, doc ){
        return userId ? true : false;
    }
});

/**
 * ROOMS COLLECTION RULES
 */
Bolt.Collections.Rooms.allow({
    insert: function( userId, doc ){
        // return userId ? true : false;
        return true;
    },
    update: function( userId, doc ){
        // return userId || doc._id ? true : false;
        return true;
    },
    remove: function( userId, doc ){
        return userId ? true : false;
    }
});

/**
 * SETTINGS COLLECTION RULES
 */
Bolt.Collections.Settings.allow({
    insert: function( userId, doc ){
        // return userId ? true : false;
        return true;
    },
    update: function( userId, doc ){
        // return userId || doc._id ? true : false;
        return true;
    },
    remove: function( userId, doc ){
        return userId ? true : false;
    }
});



Bolt.getPossibleTimes = function( date, roomId ){

    // console.log( "IN getPossibleTimes", date, roomId );
    var possibleTimes = [];

    var args ={
        date: date
    }
    if( roomId ){
        args.roomId = roomId;
    }
    // Get times for existing reservations
    var reservations = Bolt.Collections.Reservations.find( args ).fetch();
    if( reservations && reservations.length > 0 ){
        _.each( reservations, function( reservation ){
           possibleTimes.push( reservation.time );
        });
    }

    // Get start times for each room
    var roomArgs = {available:true};
    if( roomId ){
        roomArgs._id = roomId;
    }
    var rooms = Bolt.Collections.Rooms.find(roomArgs).fetch();
    if( rooms && rooms.length > 0 ){
        _.each( rooms, function(room){
            if( room && room.startTimes ) {

                _.each(room.startTimes, function (time) {
                    if( Epoch.isWeekend(date) || time == "6:30pm" || time == "8:30pm" ) {
                        possibleTimes.push(time);
                    }
                });
            }
        });
    }


    // Remove duplicates in array
    possibleTimes = _.uniq( possibleTimes );

    // Re-order items
    var earlyAMs = [];
    var lateAMs = [];
    var earlyPMs = [];
    var middlePMs = [];
    var latePMs = [];

    _.each( possibleTimes, function( pt ){
        if( pt.includes('am') ){
            if( pt.includes( '10:' ) || pt.includes( '11:' ) ){
                lateAMs.push(pt);
            }else{
                earlyAMs.push(pt);
            }
        }else{
            if( pt.includes( '12:' )) {
                earlyPMs.push(pt);
            }else if( pt.includes( '10:' ) || pt.includes( '11:' ) ){
                latePMs.push(pt);
            }else{
                middlePMs.push(pt);
            }
        }
    });

    earlyAMs = earlyAMs.sort();
    lateAMs = lateAMs.sort();
    earlyPMs = earlyPMs.sort();
    middlePMs = middlePMs.sort();
    latePMs = latePMs.sort();

    var orderedPossibleTimes = [];
    orderedPossibleTimes = orderedPossibleTimes.concat(earlyAMs);
    orderedPossibleTimes = orderedPossibleTimes.concat(lateAMs);
    orderedPossibleTimes = orderedPossibleTimes.concat(earlyPMs);
    orderedPossibleTimes = orderedPossibleTimes.concat(middlePMs);
    orderedPossibleTimes = orderedPossibleTimes.concat(latePMs);


    // console.log( "IN getPossibleTimes", orderedPossibleTimes );

    return orderedPossibleTimes;
}

Bolt.getAdminStartTimes = function(){
    var possibleTimes = [];
    for( var x = 10; x <= 11; x++ ){
        possibleTimes.push( x + ':00am' );
        possibleTimes.push( x + ':05am' );
        possibleTimes.push( x + ':10am' );
        possibleTimes.push( x + ':15am' );
        possibleTimes.push( x + ':20am' );
        possibleTimes.push( x + ':25am' );
        possibleTimes.push( x + ':30am' );
        possibleTimes.push( x + ':35am' );
        possibleTimes.push( x + ':40am' );
        possibleTimes.push( x + ':45am' );
        possibleTimes.push( x + ':50am' );
        possibleTimes.push( x + ':55am' );
    }
    possibleTimes.push( x + ':00pm' );
    possibleTimes.push( x + ':05pm' );
    possibleTimes.push( x + ':10pm' );
    possibleTimes.push( x + ':15pm' );
    possibleTimes.push( x + ':20pm' );
    possibleTimes.push( x + ':25pm' );
    possibleTimes.push( x + ':30pm' );
    possibleTimes.push( x + ':35pm' );
    possibleTimes.push( x + ':40pm' );
    possibleTimes.push( x + ':45pm' );
    possibleTimes.push( x + ':50pm' );
    possibleTimes.push( x + ':55pm' );
    for( var x = 1; x <= 10; x++ ){
        possibleTimes.push( x + ':00pm' );
        possibleTimes.push( x + ':05pm' );
        possibleTimes.push( x + ':10pm' );
        possibleTimes.push( x + ':15pm' );
        possibleTimes.push( x + ':20pm' );
        possibleTimes.push( x + ':25pm' );
        possibleTimes.push( x + ':30pm' );
        possibleTimes.push( x + ':35pm' );
        possibleTimes.push( x + ':40pm' );
        possibleTimes.push( x + ':45pm' );
        possibleTimes.push( x + ':50pm' );
        possibleTimes.push( x + ':55pm' );
    }
    return possibleTimes;
}

Bolt.getAdminDay = function( date ){

    // console.log( 'ADMIN DAY' );

    // Get time slots
    var times = Bolt.getPossibleTimes( date );

    var day = {};
    day.date = date;
    day.times = [];


    // For each time
    //console.log( times );
    _.each( times, function(time){

        var timeObject = {};

        timeObject.time = time;
        timeObject.rooms = [];

        // Get rooms
        var rooms = Bolt.Collections.Rooms.find({
            // startTimes: {
            //     $in: [time]
            // },
            openingDate: {
                $lte: date
            },
            available: true
        }).fetch();


        // Also fetch reservations on special schedule
        if( rooms.length == 0 ) {
            // var specialScheduleReservations = Bolt.Collections.Reservations.find({
            //     date: date,
            //     time: time
            // }).fetch();
            // if (specialScheduleReservations && specialScheduleReservations.length > 0) {
            //     _.each(specialScheduleReservations, function (ssr) {
            //         var room = Bolt.Collections.Rooms.findOne(ssr.roomId);
            //         rooms.push(room);
            //     });
            // }
        }

        // for each room
        _.each( rooms, function( room ){

            // Get game
            var game = new Bolt.Game({
                date: date,
                time: time,
                roomId: room._id
            });

            // If game is in DB, add it to room
            if( game._id ){
                room.game = game;
            }

            timeObject.rooms.push( room );

        });

        day.times.push( timeObject );


    });

    // console.log( 'adminDay', day );
    return day;

}

Bolt.getCalendarDay = function( date ){

    // console.log( 'ADMIN DAY' );

    // Get time slots
    var times = Bolt.getPossibleTimes( date );

    var day = {};
    day.date = date;
    // day.times = [];
    //
    //
    // // For each time
    // _.each( times, function(time){
    //
    //     var timeObject = {};
    //
    //     timeObject.time = time;
    //     timeObject.rooms = [];
    //
    //     // Get rooms
    //     var rooms = Bolt.Collections.Rooms.find({
    //         startTimes: {
    //             $in: [time]
    //         },
    //         openingDate: {
    //             $lte: date
    //         },
    //         available: true
    //     }).fetch();
    //
    //
    //     // Also fetch reservations on special schedule
    //     if( rooms.length == 0 ) {
    //         var specialScheduleReservations = Bolt.Collections.Reservations.find({
    //             date: date,
    //             time: time
    //         }).fetch();
    //         if (specialScheduleReservations && specialScheduleReservations.length > 0) {
    //             _.each(specialScheduleReservations, function (ssr) {
    //                 var room = Bolt.Collections.Rooms.findOne(ssr.roomId);
    //                 rooms.push(room);
    //             });
    //         }
    //     }
    //
    //     // for each room
    //     _.each( rooms, function( room ){
    //
    //         // Get game
    //         var game = new Bolt.Game({
    //             date: date,
    //             time: time,
    //             roomId: room._id
    //         });
    //
    //         // If game is in DB, add it to room
    //         if( game._id ){
    //             room.game = game;
    //         }
    //
    //         timeObject.rooms.push( room );
    //
    //     });
    //
    //     day.times.push( timeObject );
    //
    //
    // });


    day.games = Bolt.Collections.Games.find({date:day.date}).fetch();

    console.log( 'adminDay', day );
    return day;

}

/**
 * CLIENT-ONLY FUNCTIONS
 */
if( Meteor.isClient ) {

    // ORDER PROCESSING MESSAGE...
    Bolt.showProcessing = function(){
        $('.processing-bg').show();
    }
    Bolt.hideProcessing = function(){
        $('.processing-bg').hide();
    }

    /**
     * Notification settings
     */
    Meteor.startup(function () {
        _.extend(Notifications.defaultOptions, {
            timeout: 5000
        });
    });

    /**
     * FUNCTION Bolt.getConfirmationEmailBody
     *
     * Generate HTML for confirmation email
     *
     * @param resId : String : a reservation _id
     * @returns String : the email body HTML
     */
    Bolt.getConfirmationEmailBody = function( reservation ){

        // var reservation = Bolt.Collections.Reservations.findOne(resId);

        // var room = Bolt.Collections.Rooms.findOne(reservation.roomId);
        var game = new Bolt.Game({
            reservationPublicId: reservation.publicId
        });

        var room = reservation.room;
        var body = '<div style="background-color: #ddd; padding: 30px;">' +
                '<div style="padding: 0px; width: 120px; margin: 0 auto; ">' +
                '<img src="https://www.escaperoomkauai.com/images/social-banner-logo.png" width="120" height="120">' +
                '</div>' +
                '<br><br>' +
                '<div style="background-color: #fff; padding: 30px; max-width: 380px; margin: 0 auto; ">' +
                'KAUAI ESCAPE ROOM - RESERVATION CONFIRMATION</b>' +
                '<br><br>' +
                '***** IMPORTANT *****' +
                '<br>' +
                'Please arrive 10 minutes before the game start time.' +
                '<br>' +
                'If you arrive late we may have to cut your game time short.' +
                '<br><br>' +
                '<b>Game: ' + room.title +
                '<br><br>' +
                'Date and time: ' + game.date + ' @ ' + game.time +
                '<br><br>' +
                'Number of players: ' + reservation.nbPlayers +
                '</b><br><br>' +
                'Reserved under: <br>' +
                reservation.firstName + ' ' + reservation.lastName + '<br>' +
                reservation.email + '<br>' +
                reservation.phone +
                '<br><br>' +
                '<a href="https://www.escaperoomkauai.com/confirmation/'+reservation.publicId+'">Click here to view reservation details online</a>' +
            '<br><br>' +
            '<b>CHECK-IN</b>' +
            '<br><br>' +
            'Please arrive 10 minutes in advance.' +
            '<br><br>' +
            '<b>PARKING</b>' +
            '<br><br>' +
            'Parking is available behind our building. You might also be able to park on Rice street depending on the time and day of the week. It may take you a few minutes to find parking, especially on weekdays before 6pm, so please plan accordingly.' +
            '<br><br>' +
            'PLEASE CALL 808.635.6957 IF YOU HAVE ANY QUESTIONS OR NEED HELP WITH DIRECTION.' +
            '<br><br>' +
            '<b>LOCATION AND DIRECTIONS:</b>' +
            '<br><br>' +
            '<a href="https://goo.gl/maps/mWRUjqwzzvj">Click here to view on Google Maps</a>' +
            '<br>' +
            'or go to ' +
            '<br>' +
            'https://goo.gl/maps/mWRUjqwzzvj' +
            '<br><br>' +
            '<b>REMINDERS:</b>' +
            '<br><br>' +
            '* Our escape games take place in relatively small rooms with no windows.' +
            '<br><br>' +
            '* Reading may be required at various points during the games; please bring reading glasses if needed.' +
            '<br><br>' +
            '* At least 1 player in each group must not be colorblind.' +
            '<br><br>' +
            'See you soon!' +
            '<br><br>' +
            '---' +
            '<br><br>' +
            'Kauai Escape Room' +
            '<br>' +
            '4353 Rice Street, Suite #1' +
            '<br>' +
            'Lihue, HI 96766' +
            '<br>' +
            'escaperoomkauai.com' +
            '<br>' +
            'info@escaperoomkauai.com' +
            '<br>' +
            '808.635.6957' +
                '</div>' +
                '</div>'
            ;
        return body;
    }

    /**
     * FUNCTION Bolt.getNotificationEmailBody
     *
     * Generate HTML for notification email
     *
     * @param resId : String : a reservation _id
     * @returns String : the email body HTML
     */
    Bolt.getNotificationEmailBody = function( reservation ){

        // var room = Bolt.Collections.Rooms.findOne(reservation.roomId);
        var game = new Bolt.Game({
            reservationPublicId: reservation.publicId
        });

        var body = '<div style="background-color: #ddd; padding: 30px;">' +
            '<div style="padding: 0px; width: 120px; margin: 0 auto; ">' +
            '<img src="https://www.escaperoomkauai.com/images/social-banner-logo.png" width="120" height="120">' +
            '</div>' +
            '<br><br>' +
            '<div style="background-color: #fff; padding: 30px; max-width: 380px; margin: 0 auto; ">' +
            'KAUAI ESCAPE ROOM - RESERVATION NOTIFICATION</b>' +
            '<br><br>' +
            '<b>Game: ' + reservation.room.title +
            '<br><br>' +
            'Date and time: ' + game.date + ' @ ' + game.time +
            '<br><br>' +
            'Number of players: ' + reservation.nbPlayers +
            '</b><br><br>' +
            'Reserved under: <br>' +
            reservation.firstName + ' ' + reservation.lastName + '<br>' +
            reservation.email + '<br>' +
            reservation.phone +
            '<br><br>' +
                '<a href="https://www.escaperoomkauai.com/confirmation/'+reservation.publicId+'">Click here for reservation details</a>';
        return body;
    }


    /**
     * FUNCTION Bolt.getFollowUpEmailBody
     *
     * Generate HTML for follow up email
     *
     * @param resId : String : a reservation _id
     * @returns String : the email body HTML
     */
    Bolt.getFollowUpEmailBody = function(  ){

        var body = '<div style="background-color: #ddd; padding: 30px;">' +
            '<div style="padding: 0px; width: 120px; margin: 0 auto; ">' +
            '<img src="https://www.escaperoomkauai.com/images/social-banner-logo.png" width="120" height="120">' +
            '</div>' +
            '<br><br>' +
            '<div style="background-color: #fff; padding: 30px; max-width: 380px; margin: 0 auto; ">' +
            'THANK YOU FOR PLAYING OUR ESCAPE GAME!</b>' +
            '<br><br>' +
            'If you have any suggestions on how we can improve please let us know at info@escaperoomkauai.com.' +
            '<br><br>' +
            'If you enjoyed your experience please review us online:' +
            '<br><br>' +
            '<a href="https://www.google.com/search?q=Kauai%20Escape%20Room&ludocid=8276498310937716148#lrd=0x0:0x72dc075cef9025b4,1">Google Review</a>' +
            '<br><br>' +
            '<a href="https://www.tripadvisor.com/Attraction_Review-g60623-d10595237-Reviews-Kauai_Escape_Room-Lihue_Kauai_Hawaii.html">TripAdvisor Review</a>' +
            '<br><br>' +
            '<a href="http://www.yelp.com/biz/kauai-escape-room-lihue">Yelp Review</a>' +
            '<br><br>' +
            '<a href="https://www.facebook.com/kauaiescaperoom/reviews/">Facebook Review</a>' +
            '<br><br>' +
            'Your feedback makes a world of difference. Thanks again for playing our escape game. See you soon!' +
            '<br><br>' +
            'Aloha!' +
            '<br><br>' +
            '-- The Kauai Escape Room Team';
        return body;
    }



    /**
     * FUNCTION Bolt.canClose
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
    Bolt.canClose = function (roomId, date, time) {


        // Get room data
        var room = Bolt.Collections.Rooms.findOne(roomId);



        // Get nb of players being booked
        var selectedNbPlayers = Session.get( 'selectedNbPlayers' );

        // Get all existing reservations for requested time slot
        var reservations = Bolt.Collections.Reservations.find({
            roomId: roomId,
            time: time,
            date: date
        }).fetch();

        // Calculate how many spots are available before current reservation request
        var spotsLeft = Bolt.spotsLeft(roomId, date, time);


        // Can the room be closed?
        // Rooms can be close if the reservation is the first for a time
        // slot and if the number of players requested
        // is less than the max nb players for the room
        return spotsLeft == room.maxPlayers && !(room.maxPlayers == selectedNbPlayers);

    }

    /**
     * FUNCTION: Bolt.spotsLeft
     *
     * Calculate how many spots are available for a time slot
     *
     * @param roomId
     * @param date
     * @param time
     * @returns {number}
     */
    Bolt.spotsLeft = function (roomId, date, time) {

        // console.log( 'checking spots left for', roomId, date, time );

        // Get room data
        var room = Bolt.Collections.Rooms.findOne(roomId);

        if( room ) {
            // Get all existing reservations for requested time slot
            var reservations = Bolt.Collections.Reservations.find({
                // $or: [
                //     {
                //         roomId: roomId,
                //         time: time,
                //         date: date
                //     },
                //     {
                //         blocked: true,
                //         time: time,
                //         date: date
                //     }
                //
                // ]
                roomId: roomId,
                time: time,
                date: date

            }).fetch();

            //console.log( 'FOUND RESERVATIONS', reservations );

            // Calculate how many spots are available before current reservation request
            var isClosed = false;
            var blocked = false;
            var spotsLeft = room.maxPlayers;
            if (reservations && reservations.length > 0) {
                _.each(reservations, function (reservation) {
                    //console.log( 'Reservation', reservation );
                    if (reservation.closeRoom) {
                        isClosed = true;
                    }
                    if (reservation.blocked) {
                        blocked = true;
                    } else {
                        spotsLeft = spotsLeft - reservation.nbPlayers;
                    }
                });
            }
            if (isClosed || blocked) {
                spotsLeft = 0;
            }

        }
        // All done. Return number of spots available
        return spotsLeft || 0;

    }

    Bolt.calculateSubtotal = function( roomId, nbPlayers, closedRoom ){
        var room = Bolt.Collections.Rooms.findOne(roomId);
        if( room ) {
            return parseInt(nbPlayers) * room.pricePerPlayer + ( closedRoom ? 20 : 0 );
        }else{
            return 0;
        }
    }

    Bolt.calculateDiscount = function( roomId, nbPlayers, couponDiscount, closedRoom ){
        var subtotal = Bolt.calculateSubtotal(roomId,nbPlayers,closedRoom);
        if( subtotal && couponDiscount ) {
            return ( parseFloat(subtotal) * parseFloat(couponDiscount) / 100 ).toFixed(2);
        }else{
            return 0;
        }
    }

    Bolt.calculateKamaaina = function( nbKamaaina ){
        if( nbKamaaina ) {
            return ( parseInt(nbKamaaina) * 5 ).toFixed(2);
        }else{
            return 0;
        }
    }

    Bolt.calculateTaxes = function( roomId, nbPlayers, nbKamaaina, couponDiscount,closedRoom){
        var subtotal = Bolt.calculateSubtotal( roomId, nbPlayers, closedRoom );
        var discount = Bolt.calculateDiscount( roomId, nbPlayers, couponDiscount, closedRoom );
        if( !discount ) {
            discount = Bolt.calculateKamaaina(nbKamaaina);
        }
        var taxes = ( ( parseFloat(subtotal).toFixed(2) - parseFloat(discount).toFixed(2) ) * parseFloat(0.04166) ).toFixed(2);


        return taxes;
    }

    Bolt.calculateTotal = function( roomId, nbPlayers, nbKamaaina, couponDiscount, closedRoom){

        var subtotal = Bolt.calculateSubtotal(roomId, nbPlayers, closedRoom);
        var discount = Bolt.calculateDiscount(roomId, nbPlayers, couponDiscount, closedRoom);
        if( !discount ) {
            discount = Bolt.calculateKamaaina(nbKamaaina);
        }
        var taxes = Bolt.calculateTaxes(roomId, nbPlayers, nbKamaaina, couponDiscount, closedRoom);
        return ( parseFloat(subtotal) - parseFloat(discount) + parseFloat(taxes) ).toFixed(2);
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
            var rooms = Bolt.Collections.Rooms.find().fetch();

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

    Meteor.methods({

        adminCreateReservation: function( formData ){

            var room = Bolt.Collections.Rooms.findOne({
                _id: formData.roomId
            });

            var gameCount = Bolt.Collections.Games.find({
                date: formData.date,
                time: formData.time,
                roomId: formData.roomId
            }).count();

            // If game doesn't exist
            if( gameCount === 0 ) {

                // Add room to form data
                var data = formData;
                data.room = room;

                // Create reservation
                var reservation = new Bolt.Reservation( data );
                var resInsert = reservation.save();

                // Create game
                var game = new Bolt.Game( data );
                var gameInsert = game.save();

                return resInsert && gameInsert ? true : false;

            // Else
            }else {
                // Update game
                //console.log('game exists')
                return false;
            }
        },

        unblockDate: function(date){
            return Bolt.Collections.Reservations.remove(
                {
                    blocked: true,
                    date: date
                }
            );
        },
        unblockTime: function(date, time, roomId){
            var resRemove = Bolt.Collections.Reservations.remove(
                {
                    blocked: true,
                    date: date,
                    time: time,
                    roomId: roomId
                }
            );
            var gameRemove = Bolt.Collections.Games.remove(
                {
                    date: date,
                    time: time,
                    roomId: roomId
                }
            );
            return gameRemove && resRemove;
        },
        blockAllForSameTimeSlot: function( resId ){
            // TODO: change this later
            // For all other rooms, create blocked red
            var rooms = Bolt.Collections.Rooms.find({}).fetch();

            var roomIDs = [];

            _.each( rooms, function( room ){
                roomIDs.push( room._id );
            });

            var resData = Bolt.Collections.Reservations.findOne(resId);
            var newRes = new Bolt.Reservation(resData);
            _.each( roomIDs, function( roomId ){
                // console.log("looping over " + roomId, newRes );
                // var room = Bolt.Collections.Rooms.findOne(roomId);
                if( roomId !== resData.roomId ){
                    // var g = new Bolt.Game({
                    //     date: newRes.date,
                    //     time: newRes.time,
                    //     roomId: roomId,
                    //     blocked: true
                    // });
                    // g.save();

                    // Don't save res if there are other reservation for another game
                    var otherGamesRes = Bolt.Collections.Reservations.find({
                        date: newRes.date,
                        time: newRes.time,
                        roomId: roomId
                    }).fetch();
                    var alreadyHasRes = otherGamesRes.length > 0;

                    if( !alreadyHasRes ) {
                        var r = new Bolt.Reservation({
                            date: newRes.date,
                            time: newRes.time,
                            roomId: roomId,
                            blocked: true
                        });
                        r.save();
                    }

                }
            });
        }
    })

}