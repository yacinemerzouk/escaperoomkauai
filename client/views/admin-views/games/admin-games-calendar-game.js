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
