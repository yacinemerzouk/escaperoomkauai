Template.home.events({
    'click [hook="explainer"]': function(evt,tmpl){
        evt.preventDefault();
        $('html, body').animate({
            scrollTop: $('#explainer').offset().top
        }, 500);
    },
    'click [hook="rooms"]': function(evt,tmpl){
        evt.preventDefault();
        $('html, body').animate({
            scrollTop: $('#rooms').offset().top
        }, 600);
    }
});

Template.home.helpers({
    rooms: function(){
        return Bolt.Collections.Rooms.find({},{sort:{order:1}});
    },
    mostPopular: function(){
        return Bolt.Collections.Rooms.findOne({slug:'mad-scientist'})
    }
});