Template.rooms.onCreated(function(){
    Meteor.subscribe( 'rooms' );
    Meteor.subscribe( 'games' );
});

Template.rooms.rendered = function(){

    fbq('track', 'Search');

    $( "#datepicker" ).datepicker();
}

Template.rooms.helpers({
    rooms: function(){
        return Bolt.Collections.Rooms.find({ published: {$not: false}, available:true}, {sort:{order:1}});
    },
    mostPopular: function(){
        return Bolt.Collections.Rooms.findOne({slug:'mad-scientist'})
    }
});