Template.adminRooms.helpers({
    rooms: function(){
        return Bolt.Collections.Rooms.find({ published: {$not: false}}, {sort:{order:-1}});
    }
});