Template.gamePlay.helpers({
   game: function(){
       var gameData = Bolt.Collections.Games.findOne(this._id);
       var game = new Bolt.Game(gameData);
       return game;
   },
    room: function(){
        var gameData = Bolt.Collections.Games.findOne(this._id);
        var game = new Bolt.Game(gameData);
        var room = Bolt.Collections.Rooms.findOne(game.roomId);
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


Template.gamePlay.events({
    'submit form': function(evt,tmpl){
        evt.preventDefault();
        Notifications.info('Sending message...');
        $('[type="submit"]').attr("disabled","disabled");
        var formData = Bureaucrat.getFormData($(evt.currentTarget));
        //console.log('form data', formData, $('[name="device"]:checked').val() );

        // Configure the Twilio client
        Meteor.call('sendSMS', formData.message, $('[name="device"]:checked').val(), function(error,response){
            if( error ){
                //console.log( error );
                Notifications.error( error.message );
            }else{
                //console.log(response);
                var gameData = Bolt.Collections.Games.findOne(tmpl.data._id);
                var game = new Bolt.Game(gameData);
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
        var gameData = Bolt.Collections.Games.findOne(tmpl.data._id);
        var game = new Bolt.Game(gameData);
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
        var gameData = Bolt.Collections.Games.findOne(tmpl.data._id);
        var game = new Bolt.Game(gameData);
        game.timeLog = gameTime;
        if( game.save() ){
            Notifications.success( "Game time saved." );
        }else{
            Notifications.error( "Error", "Game time NOT saved." );
        }
    },
    'click [hook="send-follow-up"]': function(evt,tmpl) {
        var gameData = Bolt.Collections.Games.findOne(tmpl.data._id);
        var game = new Bolt.Game(gameData);
        game.sendFollowUpEmail();
    },
    'click [hook="send-intro"]': function(evt,tmpl) {
        Notifications.info("Sending intro");
        var gameData = Bolt.Collections.Games.findOne(tmpl.data._id);
        var game = new Bolt.Game(gameData);

        var room = Bolt.Collections.Rooms.findOne(game.roomId);
        Meteor.call('sendSMS', room.intro, $('[name="device"]:checked').val(), function(error,response){
           if( error ){
               Notifications.error("Intro NOT sent.");
               throw new Meteor.Error("Game|click|send-intro",error.message);
           }else{
               if( !game.messages ){
                   game.messages = []
               }
               game.messages.push(response);
               game.save();
               Notifications.success("Intro sent.");
           }
        });

    },
    'click [hook="send-outro"]': function(evt,tmpl) {
        Notifications.info("Sending outro");
        var room = Bolt.Collections.Rooms.findOne(tmpl.data.roomId);
        Meteor.call('sendSMS', room.outro, $('[name="device"]:checked').val(), function(error,response){
            if( error ){
                Notifications.error("Outro NOT sent.");
                throw new Meteor.Error("Game|click|send-outro",error.message);
            }else{
                var gameData = Bolt.Collections.Games.findOne();
                var game = new Bolt.Game(gameData);
                if( !game.messages ){
                    game.messages = []
                }
                game.messages.push(response);
                game.save();
                Notifications.success("Outro sent.");
            }
        });

    },
    'click [hook="send-demo"]': function(evt,tmpl) {
        Notifications.info("Sending demo");
        Meteor.call('sendSMS', 'Example of message', $('[name="device"]:checked').val(), function(error,response){
            if( error ){
                Notifications.error("Demo NOT sent.");
                throw new Meteor.Error("Game|click|send-demo",error.message);
            }else{
                Notifications.success("Demo sent.");
            }
        });

    }
});