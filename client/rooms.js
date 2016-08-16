Template.rooms.rendered = function(){
    $( "#datepicker" ).datepicker();
}

Template.rooms.helpers({
    rooms: function(){
        return EscapeRoom.Collections.Rooms.find();
    },
    mostPopular: function(){
        return EscapeRoom.Collections.Rooms.findOne({slug:'mad-scientist'})
    }
});