/**
 * ROOMS: publish all rooms, all data
 */
Meteor.publish('rooms', function(){
    var rooms = EscapeRoom.Collections.Rooms.find({},{sort:{order:1}});
    return rooms;
});

/**
 * ROOMS: publish single room, all data
 */
Meteor.publish('room', function( slug ){
    var room = EscapeRoom.Collections.Rooms.find( { slug:slug } );
    return room;
});

/**
 * RESERVATIONS: publish all reservations, all data
 * TODO: better pubsub
 */
Meteor.publish('reservations', function(){
    var reservations = EscapeRoom.Collections.Reservations.find();
    return reservations;
});

Meteor.publish('futureReservations', function(){
    var today = Epoch.dateObjectToDateString(new Date());
    var reservations = EscapeRoom.Collections.Reservations.find({date:{$gte:today}});
    return reservations;
});

Meteor.publish('reservation', function( _id ){
    var reservation = EscapeRoom.Collections.Reservations.find({_id:_id});
    return reservation;
});

Meteor.publish('coupons', function(){
    var coupons = EscapeRoom.Collections.Coupons.find();
    return coupons;
});

Meteor.publish('games', function(){
    var games = EscapeRoom.Collections.Games.find();
    return games;
});