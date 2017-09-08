Template.adminGamesCalendarGame.events({
    'click [hook="block"]': function(evt,tmpl){
        evt.preventDefault();
        var game = new Bolt.Game(tmpl.data._id);
        game.blocked = true;
        game.save();
    }
});

Template.adminGamesCalendarGame.events({
    'click [hook="unblock"]': function(evt,tmpl){
        evt.preventDefault();
        var game = new Bolt.Game(tmpl.data._id);
        game.blocked = false;
        game.save();
    }
});