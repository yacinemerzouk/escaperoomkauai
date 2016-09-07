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
    }
});