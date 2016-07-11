/**
 * ROOMS: publish all rooms, all data
 */
Meteor.publish('rooms',function(){
    var rooms = EscapeRoom.Collections.Rooms.find();
    return rooms;
});

/**
 * RESERVATIONS: publish all reservations, all data
 * TODO: better pubsub
 */
Meteor.publish('reservations',function(){
    var reservations = EscapeRoom.Collections.Reservations.find();
    return reservations;
});