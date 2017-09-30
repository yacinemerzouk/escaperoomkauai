/**
 * =============================================================
 * DATA CONTEXT
 * Template data: none
 * Router subscriptions: none
 * Template subscriptions: none
 * =============================================================
 */

/**
 * =============================================================
 * TEMPLATE CREATED
 * =============================================================
 */
Template.gamePlay.onCreated(function(){
    this.timer;
    var self = this;
    this.countdown = function( elementName, minutes, seconds ){
        clearTimeout( self.timer );
        elementName = elementName || "countdown";
        if( !minutes && minutes !== 0 ){
            minutes = 60;
        }
        seconds = seconds || 0;

        var element, endTime, hours, mins, msLeft, time;

        function twoDigits( n )
        {
            return (n <= 9 ? "0" + n : n);
        }

        function updateTimer()
        {
            msLeft = endTime - (+new Date);
            if ( msLeft < 1000 ) {
                element.innerHTML = "0:00";
            } else {
                time = new Date( msLeft );
                hours = time.getUTCHours();
                mins = time.getUTCMinutes();
                secs = twoDigits( time.getUTCSeconds() );
                element.innerHTML = (hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds() );
                self.timer = setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
                // if( secs == 50 ){
                //     document.getElementById('news').innerHTML = "COULD SINK TIKI ISLAND";
                // }else if( secs == 40 ){
                //     document.getElementById('news').innerHTML = "ERUPTION TO TRIGGER CHAIN REACTION";
                // }else if( secs == 30 ){
                //     document.getElementById('news').innerHTML = "AND CAUSE MORE VOLCANO ERUPTIONS";
                // }else if( secs == 20 ){
                //     document.getElementById('news').innerHTML = "ALL ACROSS PACIFIC RIM";
                // }else if( secs == 10 ){
                //     document.getElementById('news').innerHTML = "1 BILLION PEOPLE COULD DIE!";
                // }else{
                //     document.getElementById('news').innerHTML = document.getElementById('news').innerHTML + ".";
                // }
            }

        }

        element = document.getElementById( elementName );
        endTime = (+new Date) + 1000 * (60*minutes + seconds) + 500;
        updateTimer();
    };
    
});

/**
 * =============================================================
 * TEMPLATE RENDERED
 * =============================================================
 */
Template.gamePlay.onRendered(function(){
    //this.countdown();
    var self = this;
    var resetDocReactive = Bolt.Collections.tikiCountdownStatus.find().fetch();
    var lastResetTime = resetDocReactive[0].resetTime;
    var dateObject = new Date();
    var currentTime = dateObject.getTime();
    var secondsSinceLastReset = parseInt( ( currentTime - lastResetTime ) / 1000 );
    // console.log( 'SECONDS SINCE LAST RESET', secondsSinceLastReset );
    if( secondsSinceLastReset < 3600 ){
        var secondsLeftOnCountdown = 3600 - secondsSinceLastReset;
        var countdownSeconds = secondsLeftOnCountdown % 60;
        var countdownMinutes = parseInt( Math.floor( secondsLeftOnCountdown / 60 ) );
        this.countdown( "countdown", countdownMinutes, countdownSeconds );
    }
    // this.autorun(function(){
    //     console.log( 'SECONDS SINCE LAST RESET', secondsSinceLastReset );
    //     console.log(Session.get('lastReset'));
    //     if( lastResetTime !== Session.get('lastReset') ){
    //         Session.set('lastReset',lastResetTime);
    //         clearTimeout(self.timer);
    //         self.countdown();
    //     }
    // });
});


/**
 * =============================================================
 * TEMPLATE DESTROYED
 * =============================================================
 */
Template.gamePlay.onDestroyed(function(){});

/**
 * =============================================================
 * TEMPLATE EVENTS
 * =============================================================
 */
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
        var gameData = Bolt.Collections.Games.findOne(tmpl.data._id);
        var game = new Bolt.Game(gameData);

        var room = Bolt.Collections.Rooms.findOne(game.roomId);
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

    },
    'click [hook="start-timer"]': function(evt,tmpl) {

        evt.preventDefault();
        // Write to tikiCountdownStatus
        if( confirm( "WARNING! PLEASE CONFIRM:\nRESTART TIMER AT 60:00?") ) {
            var statusUpdated;
            var newResetTime = new Date().getTime();
            Bolt.Collections.tikiCountdownStatus.update(
                {_id: "HdbcttuYTtwWvGKoS"},
                {$set: {room: "tiki", resetTime: newResetTime}},
                function (err, rows) {
                    if (err) {
                        console.log(err);
                    } else {
                        statusUpdated = rows;
                        // console.log( 'timer started', statusUpdated );
                        //Session.set('lastReset', newResetTime);
                        tmpl.countdown("countdown",60,0);
                    }
                }
            );
        }

    },
    /**
     * Add 1 minute to game clock
     * @param evt
     * @param tmpl
     */
    'click [hook="add-minute"]': function(evt,tmpl) {

        // Prevent default event behavior
        evt.preventDefault();

        var countdownDocs = Bolt.Collections.tikiCountdownStatus.find({}).fetch();
        var countdown = countdownDocs[0];
        var newResetTime = countdown.resetTime + 60000;
        Bolt.Collections.tikiCountdownStatus.update(
            {_id: "HdbcttuYTtwWvGKoS"},
            {$set: {room: "tiki", resetTime: newResetTime}},
            function (err, rows) {
                if (err) {
                    console.log(err);
                } else {
                    statusUpdated = rows;
                    // console.log( 'timer started', statusUpdated );
                    //Session.set('lastReset', newResetTime);
                    var dateObject = new Date();
                    var currentTime = dateObject.getTime();
                    var secondsSinceLastReset = parseInt( ( currentTime - newResetTime ) / 1000 );
                    // console.log( 'SECONDS SINCE LAST RESET', secondsSinceLastReset );
                    if( secondsSinceLastReset < 4800 ){
                        var secondsLeftOnCountdown = 3600 - secondsSinceLastReset;
                        var countdownSeconds = secondsLeftOnCountdown % 60;
                        var countdownMinutes = parseInt( Math.floor( secondsLeftOnCountdown / 60 ) );
                        // console.log( countdownMinutes, countdownSeconds );
                        tmpl.countdown( "countdown", countdownMinutes, countdownSeconds );
                    }
                }
            }
        );
    },
    /**
     * Remove minute
     * @param evt
     * @param tmpl
     */
    'click [hook="remove-minute"]': function(evt,tmpl){

        // Prevent default event behavior
        evt.preventDefault();

        var countdownDocs = Bolt.Collections.tikiCountdownStatus.find({}).fetch();
        var countdown = countdownDocs[0];
        var newResetTime = countdown.resetTime - 60000;
        var dateObject = new Date();
        var currentTime = dateObject.getTime();
        var secondsSinceLastReset = parseInt( ( currentTime - newResetTime ) / 1000 );
        // console.log( 'SECONDS SINCE LAST RESET', secondsSinceLastReset );
        if( secondsSinceLastReset < 3600 ) {
            Bolt.Collections.tikiCountdownStatus.update(
                {_id: "HdbcttuYTtwWvGKoS"},
                {$set: {room: "tiki", resetTime: newResetTime}},
                function (err, rows) {
                    if (err) {
                        // console.log(err);
                    } else {
                        statusUpdated = rows;
                        // console.log( 'timer started', statusUpdated );
                        //Session.set('lastReset', newResetTime);
                        if (secondsSinceLastReset < 4800) {
                            var secondsLeftOnCountdown = 3600 - secondsSinceLastReset;
                            var countdownSeconds = secondsLeftOnCountdown % 60;
                            var countdownMinutes = parseInt(Math.floor(secondsLeftOnCountdown / 60));
                            // console.log(countdownMinutes, countdownSeconds);

                            tmpl.countdown("countdown", countdownMinutes, countdownSeconds);
                        }
                    }
                }
            );
        }else{
            Notifications.error( 'Cannot remove 1 minute.', 'Less than 1 minute left' );
        }

    }
});


/**
 * =============================================================
 * TEMPLATE HELPERS
 * =============================================================
 */
Template.gamePlay.helpers({
    game: function(){
        var gameData = Bolt.Collections.Games.findOne(this._id);
        var game = new Bolt.Game(gameData);
        return game;
    },
    isTikiLounge: function(){
        var gameData = Bolt.Collections.Games.findOne(this._id);
        var game = new Bolt.Game(gameData);
        // console.log('isTiki', game);
        return game.roomId == "3uvLANaxBvEfH4ZLH";
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