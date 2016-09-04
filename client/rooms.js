Template.rooms.rendered = function(){
    $( "#datepicker" ).datepicker();
}

Template.rooms.helpers({
    rooms: function(){
        return Bolt.Collections.Rooms.find({},{sort:{order:1}});
    },
    mostPopular: function(){
        return Bolt.Collections.Rooms.findOne({slug:'mad-scientist'})
    }
});