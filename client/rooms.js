Template.rooms.rendered = function(){
    $( "#datepicker" ).datepicker();
}

Template.rooms.helpers({
    rooms: function(){
        return Bolt.Collections.Rooms.find();
    },
    mostPopular: function(){
        return Bolt.Collections.Rooms.findOne({slug:'mad-scientist'})
    }
});