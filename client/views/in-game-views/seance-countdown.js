Template.seanceCountdown.onCreated(function(){
    var self = this;
    self.timer;
    this.countdown = function( elementName, minutes, seconds ){
        // console.log( minutes, seconds );
        // if( minutes == 59 && seconds >= 55 ){
        //     var music = document.getElementById("music");
        //     music.volume = 0.5;
        //     music.currentTime = 0;
        //     music.play();
        //
        // }
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
                var x = document.getElementById("siren");
                x.play();

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

    this.checkLastReset = function(){
        if( this.lastReset !== Session.get('lastReset') ){
            // console.log('reset');
        }
    }
});
Template.seanceCountdown.onRendered(function(){
    var self = this;
    this.autorun(function() {

        var resetDocReactive = Bolt.Collections.seanceCountdownStatus.find().fetch();
        var lastResetTime = resetDocReactive[0].resetTime;
        var dateObject = new Date();
        var currentTime = dateObject.getTime();
        var secondsSinceLastReset = parseInt(( currentTime - lastResetTime ) / 1000);
        if (secondsSinceLastReset < 3600) {
            var secondsLeftOnCountdown = 3600 - secondsSinceLastReset;
            var countdownSeconds = secondsLeftOnCountdown % 60;
            var countdownMinutes = parseInt(Math.floor(secondsLeftOnCountdown / 60));
            self.countdown("countdown", countdownMinutes, countdownSeconds);
        }
        if( resetDocReactive[0].playLaserAudio === true ){
            Bolt.Collections.seanceCountdownStatus.update(

                {
                    _id: "CjkxgQJ2HkTpXntFa"
                },
                {
                    $set: {
                        playLaserAudio: false
                    }

                }

            );
            var laserAudio = document.getElementById("laser-audio");
            laserAudio.currentTime = 0;
            laserAudio.play();

        }
        if( resetDocReactive[0].playMusic === true ){
            Bolt.Collections.seanceCountdownStatus.update(

                {
                    _id: "CjkxgQJ2HkTpXntFa"
                },
                {
                    $set: {
                        playMusic: false
                    }

                }

            );
            // UNCOMMENT ONCE MUSIC IS READY
            var music = document.getElementById("music");
            music.volume = 0.5;

            music.currentTime = 0;
            music.play();

        }
    });
});


Template.seanceCountdown.helpers({
    latestMessage: function(){
        var countdownData = Bolt.Collections.seanceCountdownStatus.findOne();
        var game = Bolt.Collections.Games.findOne( countdownData.gameId );
        console.log( countdownData, game );
        var currentMessageOnScreen = document.getElementById('message').innerHTML;
        var messageToDisplay = game.messages[game.messages.length - 1].body;
        console.log( currentMessageOnScreen, messageToDisplay);
        if( currentMessageOnScreen !== messageToDisplay ){
            var newMessage = document.getElementById("new-message");
            newMessage.currentTime = 0;
            newMessage.play();
        }
        return messageToDisplay;
    }
});

