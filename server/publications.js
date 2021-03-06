/**
 * Room list
 */
Meteor.publish('roomList', function() {
    var roomListCursor = Bolt.Collections.Rooms.find(
        {
            published: true
        },
        {
            fields: {
                _id: 1,
                title: 1,
                excerpt: 1,
                slug: 1,
                image: 1,
                order: 1,
                published: 1,
                available: 1,
                ribbon: 1,
                opening: 1,
                description: 1,
                minPlayers: 1,
                maxPlayers: 1,
                duration: 1,
                priceRange: 1,
            }
        }
    );
    return roomListCursor;
});

/**
 * roomOverviewList
 */
Meteor.publish('roomOverviewList', function() {
    var roomOverviewListCursor = Bolt.Collections.Rooms.find(
        {
            published: true
        },
        {
            fields: {
                _id: 1,
                title: 1,
                description: 1,
                minPlayers: 1,
                maxPlayers: 1,
                duration: 1,
                successRate: 1,
                priceRange: 1,
                slug: 1,
                image: 1,
                order: 1,
                published: 1,
                available: 1,
                ribbon: 1
            }
        }
    );
    return roomOverviewListCursor;
});

/**
 * Room overview
 */
Meteor.publish('roomOverview', function( roomId ) {
    if( roomId == 'popular' ){
        roomId = '3uvLANaxBvEfH4ZLH';
    }
    var roomOverviewCursor = Bolt.Collections.Rooms.find(
        {
            _id: roomId
        },
        {
            fields: {
                _id: 1,
                title: 1,
                description: 1,
                minPlayers: 1,
                maxPlayers: 1,
                duration: 1,
                successRate: 1,
                priceRange: 1,
                slug: 1,
                image: 1
            }
        }
    );
    return roomOverviewCursor;
});
/**
 * GAME MASTERS: publish all rooms, all data
 */
Meteor.publish('gameMasters', function(){
    var gameMasters = Meteor.users.find({},{fields:{profile:1,username:1}});
    return gameMasters;
});

/**
 * TIKI COUNTDOWN: publish all documents, which is a single document
 */
Meteor.publish('tikiCountdown', function(){
    var docs = Bolt.Collections.tikiCountdownStatus.find();
    return docs;
});

/**
 * lost continent COUNTDOWN: publish all documents, which is a single document
 */
Meteor.publish('lostContinentCountdown', function(){
    var docs = Bolt.Collections.lostContinentCountdownStatus.find();
    return docs;
});

/**
 * SEANCE COUNTDOWN: publish all documents, which is a single document
 */
Meteor.publish('seanceCountdown', function(){
    var docs = Bolt.Collections.seanceCountdownStatus.find();
    return docs;
});

/**
 * ROOMS: publish all rooms, all data
 */
Meteor.publish('rooms', function(){
    var rooms = Bolt.Collections.Rooms.find({},{sort:{order:1}});
    return rooms;
});

/**
 * ROOMS: publish all rooms, basic data
 */
Meteor.publish('roomsMeta', function(){
    var rooms = Bolt.Collections.Rooms.find(
        {},
        {
            fields: {
                title: 1,
                opening: 1,
                startTimes: 1,
                slug: 1,
                duration: 1,
                pricePerPlayer: 1,
                priceToClose: 1,
                minPlayers: 1,
                maxPlayers: 1,
                successRate: 1,
                available: 1,
                order: 1,
                kamaainaDiscountPerPlayer: 1,
                openingDate: 1
            }
        },
        {
            sort:{
                order:1
            }
        }
    );
    return rooms;
});

/**
 * ROOMS: publish single room, all data
 */
Meteor.publish('room', function( slug ){
    var room = Bolt.Collections.Rooms.find( { slug:slug } );
    return room;
});
Meteor.publish('roomById', function( roomId ){
    var room = Bolt.Collections.Rooms.find( { _id:roomId } );
    return room;
});

Meteor.publish('pastGameResults', function( slug ){
    // var games = Bolt.Collections.Games.find( { date: {$lte: Epoch.dateObjectToDateString(new Date())} }, {fields: {_id:1, roomId: 1, won:1}} );
    // return games;
    var room = Bolt.Collections.Rooms.findOne({slug:slug});
    var date = Epoch.dateObjectToDateString( new Date() );
    var games = Bolt.Collections.Games.find(
        {
            date: {
                $lte: date
            },
            roomId: room._id
        },
        {
            fields: {
                won: 1,
                _id: 1,
                roomId: 1
            }
        }

    );
    return games;
});

/**
 * RESERVATIONS: publish all reservations, all data
 * TODO: better pubsub
 */
Meteor.publish('reservations', function( date ){
    var args;
    if( date ){
        args = {date:date};
    }else{
        args = {};
    }
    var reservations = Bolt.Collections.Reservations.find(args);
    return reservations;
});

Meteor.publish('futureReservations', function(){
    var today = Epoch.dateObjectToDateString(new Date());
    var reservations = Bolt.Collections.Reservations.find(
        {
            date: {
                $gte:today
            },
            canceled:{
                $ne:true
            }
        },
        {
            fields: {
                _id: 1,
                roomId: 1,
                date: 1,
                time: 1,
                nbPlayers: 1,
                closeRoom: 1,
                blocked: 1
            }
        }
    );
    return reservations;
});

Meteor.publish('reservationsForDate', function( date ){
    var reservations = Bolt.Collections.Reservations.find(
        {
            date: date,
            canceled:{
                $ne:true
            }
        },
        {
            fields: {
                _id: 1,
                roomId: 1,
                date: 1,
                time: 1,
                nbPlayers: 1,
                closeRoom: 1,
                blocked: 1
            }
        }
    );
    return reservations;
});

Meteor.publish('reservationNumbers', function(){
    var reservations = Bolt.Collections.Reservations.find(
        {},
        {
            fields: {
                _id:1,
                publicId:1
            },
            sort: {
                publicId: -1
            },
            limit: 1
        }
    );
    return reservations;
});



Meteor.publish('reservation', function( _id ){
    var reservation = Bolt.Collections.Reservations.find({_id:_id});
    return reservation;
});

Meteor.publish('coupons', function(){
    var coupons = Bolt.Collections.Coupons.find();
    return coupons;
});


Meteor.publish('couponById', function( _id ){
    var coupons = Bolt.Collections.Coupons.find({_id:_id});
    return coupons;
});

Meteor.publish('couponByCode', function( code ){
    var coupons = Bolt.Collections.Coupons.find({coupon:code});
    return coupons;
});

Meteor.publish('games', function(date){
    var args;
    if( date ){
        args = {date:date};
    }else{
        args = {};
    }
    var games = Bolt.Collections.Games.find(args);
    return games;
});

// Meteor.publish('gameDataForStats', function(roomId){
//     var date = Epoch.dateObjectToDateString( new Date() );
//     var games = Bolt.Collections.Games.find(
//         {
//             date: {
//                 $lte: date
//             },
//             roomId: roomId
//         },
//         {
//             fields: {
//                 won: 1
//             }
//         }
//
//     );
//     return games;
// });


Meteor.publish('futureGames', function(){
    var today = Epoch.dateObjectToDateString(new Date());

    var games = Bolt.Collections.Games.find(
        {
            date: {
                $gte:today
            }
        }
    );
    return games;

});

Meteor.publish('game',function( gameId ){
    var games = Bolt.Collections.Games.find(
        {
            _id: gameId
        }
    );
    return games;
});

Meteor.publish('gameByReservationPublicId',function( publicId ){
    var games = Bolt.Collections.Games.find(
        {
            'reservations.publicId': parseInt(publicId)
        }
    );
    // console.log(games.count());
    return games;
});

Meteor.publish('reservationsForGame',function( roomId, date, time ){
    var res = Bolt.Collections.Reservations.find(
        {
            date: date,
            time: time,
            roomId: roomId
        }
    );
    return res;
})


/**
 * SETTINGS: Publish all settings
 */
Meteor.publish('settings', function(){
    var settings = Bolt.Collections.Settings.find({},{sort:{order:1}});
    return settings;
});
