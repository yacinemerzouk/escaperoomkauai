Meteor.publish('rooms',function(){
    var rooms = EscapeRoom.Collections.Rooms.find();
    return rooms;
});

Meteor.publish('reservations',function(){
    var reservations = EscapeRoom.Collections.Reservations.find();
    return reservations;
});