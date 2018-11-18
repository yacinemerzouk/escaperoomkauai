Template.adminGamesCalendarGame.onRendered(function(){
    $('span').tooltip();
});
Template.adminGamesCalendarGame.events({
    'click [hook="block"]': function(evt,tmpl){
        evt.preventDefault();
        var game = new Bolt.Game(tmpl.data._id);
        game.blocked = true;
        game.save();
    },

    'click [hook="unblock"]': function(evt,tmpl){
        evt.preventDefault();
        var game = new Bolt.Game(tmpl.data._id);
        game.blocked = false;
        game.save();
    },

    'click [hook="remove-game"]': function(evt,tmpl){
        evt.preventDefault();
        if(confirm("DELETE PERMANENTLY?")) {
            var game = new Bolt.Game(tmpl.data._id);
            if(game.remove()){
                Notifications.success("Deleted");
            }else{
                Notifications.error("Could not delete");
            }
        }
    }
});

Template.adminGamesCalendarGame.helpers({

    couponUsed(){
        let coupon = false;
        if(this.reservations){
            this.reservations.forEach(function(reservation){
                if(reservation.coupon){
                    coupon = reservation.coupon;
                }
            });
        }
        return coupon
    },

    source(){
        let source = false;
        if(this.reservations){
            this.reservations.forEach(function(reservation){
                if(reservation.source){
                    source = reservation.source;
                }
            });
        }
        return source
    }

});
