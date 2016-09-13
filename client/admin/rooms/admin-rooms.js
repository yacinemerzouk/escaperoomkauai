Template.adminRooms.helpers({
    rooms: function(){
        return Bolt.Collections.Rooms.find({},{sort:{order:1}});
    }
});