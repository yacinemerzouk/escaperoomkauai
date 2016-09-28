Template.game.onRendered(function(){

    var self = this
    this.autorun(function(){
        // var game =  new Bolt.Game({
        //     date: this.currentData.date,
        //     time: this.currentData.time,
        //     roomId: this.currentData.roomId
        // });
        // if( !game._id ){
        //     game.save();
        // }
        // console.log( 'GAME', this, game );
        // console.log( 'Game onRendered', this, self );
    });


});
Template.game.helpers({
   game: function(){
       var game =  new Bolt.Game({
           date: this.date,
           time: this.time,
           roomId: this.roomId
       });
       //console.log( 'IN HELPER', game );
       return game;
   },
    room: function(){
        var room = Bolt.Collections.Rooms.findOne(this.roomId);
        return room;
    },
    nbPlayers: function(){
        var game =  new Bolt.Game({
            date: this.date,
            time: this.time,
            roomId: this.roomId
        });

        return game.getNbPlayers();
    },
    nbWaivers: function(){
        var game =  new Bolt.Game({
            date: this.date,
            time: this.time,
            roomId: this.roomId
        });

        return game.players ? game.players.length : 0;
    },
    messageCount: function(){
        var game =  new Bolt.Game({
            date: this.date,
            time: this.time,
            roomId: this.roomId
        });
        if( game.messages ){
            return game.messages.length;
        }else{
            return 0;
        }
    },
    gameResultLogged: function(){
        var game =  new Bolt.Game({
            date: this.date,
            time: this.time,
            roomId: this.roomId
        });
        return game.won === true || game.won === false;
    }
});


Template.game.events({
    'submit form': function(evt,tmpl){
        evt.preventDefault();
        Notifications.info('Sending message...');
        $('[type="submit"]').attr("disabled","disabled");
        var formData = Bureaucrat.getFormData($(evt.currentTarget));
        //console.log('form data', formData);

        // Configure the Twilio client
        Meteor.call('sendSMS', formData.message, function(error,response){
            if( error ){
                //console.log( error );
                Notifications.error( error.message );
            }else{
                //console.log(response);
                var game = new Bolt.Game({
                    date: tmpl.data.date,
                    time: tmpl.data.time,
                    roomId: tmpl.data.roomId
                });
                if( !game.messages ){
                    game.messages = []
                }
                game.messages.push(response);
                game.save();
                $('textarea').val('');
                Notifications.success('Message sent');

            }
            $('[type="submit"]').removeAttr("disabled");

        })

    },

    'change [hook="set-game-result"]': function(evt,tmpl){
        var won = $(evt.currentTarget).attr('hook-data-result') == "won" ? true : false;
        var game =  new Bolt.Game({
            date: tmpl.data.date,
            time: tmpl.data.time,
            roomId: tmpl.data.roomId
        });
        game.won = won;
        if( game.save() ){
            Notifications.success( "Game result saved." );
        }else{
            Notifications.error( "Error", "Game result NOT saved." );
        }

    },
    'click [hook="set-game-time"]': function(evt,tmpl){
        evt.preventDefault();
        var gameTime = $('[hook="game-time"]').val();
        var game =  new Bolt.Game({
            date: tmpl.data.date,
            time: tmpl.data.time,
            roomId: tmpl.data.roomId
        });
        game.timeLog = gameTime;
        if( game.save() ){
            Notifications.success( "Game time saved." );
        }else{
            Notifications.error( "Error", "Game time NOT saved." );
        }
    },
    'click [hook="send-follow-up"]': function(evt,tmpl) {
        var game =  new Bolt.Game({
            date: tmpl.data.date,
            time: tmpl.data.time,
            roomId: tmpl.data.roomId
        });

        game.sendFollowUpEmail();
    },
    'click [hook="send-intro"]': function(evt,tmpl) {
        Notifications.info("Sending intro");
        var room = Bolt.Collections.Rooms.findOne(tmpl.data.roomId);
        Meteor.call('sendSMS', room.intro, function(error,response){
           if( error ){
               Notifications.error("Intro NOT sent.");
               throw new Meteor.Error("Game|click|send-intro",error.message);
           }else{
               Notifications.success("Intro sent.");
           }
        });

    },
    'click [hook="send-outro"]': function(evt,tmpl) {
        Notifications.info("Sending outro");
        var room = Bolt.Collections.Rooms.findOne(tmpl.data.roomId);
        Meteor.call('sendSMS', room.outro, function(error,response){
            if( error ){
                Notifications.error("Outro NOT sent.");
                throw new Meteor.Error("Game|click|send-outro",error.message);
            }else{
                Notifications.success("Outro sent.");
            }
        });

    },
    'click [hook="send-demo"]': function(evt,tmpl) {
        Notifications.info("Sending demo");
        Meteor.call('sendSMS', 'Example of message', function(error,response){
            if( error ){
                Notifications.error("Demo NOT sent.");
                throw new Meteor.Error("Game|click|send-demo",error.message);
            }else{
                Notifications.success("Demo sent.");
            }
        });

    }
});