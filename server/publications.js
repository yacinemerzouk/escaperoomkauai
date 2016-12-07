/**
 * ROOMS: publish all rooms, all data
 */
Meteor.publish('rooms', function(){
    var rooms = Bolt.Collections.Rooms.find({},{sort:{order:1}});
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

Meteor.publish('game',function( roomId, date, time ){
    var games = Bolt.Collections.Games.find(
        {
            date: date,
            time: time,
            roomId: roomId
        }
    );
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
