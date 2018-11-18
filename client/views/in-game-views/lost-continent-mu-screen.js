Template.lostContinentMuScreen.onCreated(function(){
    var self = this;
    self.timer;
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
                var x = document.getElementById("siren");
                x.play();

            } else {
                time = new Date( msLeft );
                hours = time.getUTCHours();
                mins = time.getUTCMinutes();
                secs = twoDigits( time.getUTCSeconds() );
                element.innerHTML = (hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds() );

                var dots = document.getElementById('dots');
                // dots.innerHTML = '';
                var secondsLeft = parseInt(msLeft / 1000);
                var tens = Math.floor(secondsLeft/600);
                var units = Math.floor(secondsLeft/60);
                var remainder = secondsLeft%60
                // console.log('TENS LEFT', tens);
                // console.log('UNITS LEFT LEFT', units);
                // console.log('SECONDS LEFT', remainder)

                $('#tens').text('');
                // for (var x = 0; x < 6; x++) {
                //     if( x < tens){
                //         $('#tens').append('&#9660;') ;
                //     }else{
                //         $('#tens').append('&#9661;') ;
                //     }
                // }

                $('#units').text('');
                for(var y = 0; y < 60; y++){
                    if(y > 0 && y % 10 === 0){
                        $('#units').append('<br>') ;

                    }
                    if(y < units) {
                        $('#units').append('<span class="wt">&#9650;</span>');
                    }else{
                        $('#units').append('<span class="bt">&#9650;</span>');
                    }
                }

                $('#remainder').text('');
                for(var z = 0; z < 60; z++){
                    if(z > 0 && z % 10 === 0){
                        $('#remainder').append('<br>') ;

                    }
                    if(z < remainder) {
                        $('#remainder').append('<span class="wt">&#9660;</span>');
                    }else{
                        $('#remainder').append('<span class="bt">&#9660;</span>');
                    }
                }


                self.timer = setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
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
Template.lostContinentMuScreen.onRendered(function(){

    // var muSoundtrack = document.getElementById("mu-soundtrack");
    // muSoundtrack.volume = 0.5;
    //
    // muSoundtrack.currentTime = 0;
    // muSoundtrack.play();
    // muSoundtrack.addEventListener('ended', function() {
    //     this.currentTime = 0;
    //     this.play();
    // }, false);

    // this.lastReset = Session.get('lastReset');
    // setTimeout("this.checkLastReset()",1000);
    // this.countdown();

    // console.log('...');
    // var resetDoc = Bolt.Collections.lostContinentCountdownStatus.find();
    //
    // Session.set('lastReset',resetDoc.resetTime);
    // this.countdown();
    // var self = this;
    // this.autorun(function(){
    //     var resetDocReactive = Bolt.Collections.lostContinentCountdownStatus.find().fetch();
    //     var lastResetTime = resetDocReactive[0].resetTime;
    //     // console.log(resetDocReactive[0]);
    //     // console.log(Session.get('lastReset'));
    //     if( lastResetTime !== Session.get('lastReset') ){
    //         Session.set('lastReset',lastResetTime);
    //         clearTimeout(self.timer);
    //         self.countdown();
    //     }
    // });
    var self = this;
    this.autorun(function() {

        var resetDocReactive = Bolt.Collections.lostContinentCountdownStatus.find().fetch();
        var lastResetTime = resetDocReactive[0].resetTime;
        var dateObject = new Date();
        var currentTime = dateObject.getTime();
        var secondsSinceLastReset = parseInt(( currentTime - lastResetTime ) / 1000);
        // console.log('SECONDS SINCE LAST RESET', secondsSinceLastReset);
        if (secondsSinceLastReset < 3600) {
            var secondsLeftOnCountdown = 3600 - secondsSinceLastReset;
            var countdownSeconds = secondsLeftOnCountdown % 60;
            var countdownMinutes = parseInt(Math.floor(secondsLeftOnCountdown / 60));
            self.countdown("countdown", countdownMinutes, countdownSeconds);
        }

        // START MU SOUNDTRACK
        if( resetDocReactive[0].playMuSoundtrack === true ){
            Bolt.Collections.lostContinentCountdownStatus.update(

                {
                    _id: "9ysA4o4hbaJz24kaM"
                },
                {
                    $set: {
                        playMuSoundtrack: false
                    }

                }

            );
            var muSoundtrack = document.getElementById("mu-soundtrack");
            muSoundtrack.volume = 0.8;

            muSoundtrack.currentTime = 0;
            muSoundtrack.play();
            muSoundtrack.addEventListener('ended', function() {
                this.currentTime = 0;
                this.play();
            }, false);

        }

        // LOWER MU SOUNDTRACK VOLUME
        if( resetDocReactive[0].lowerMuSoundtrackVolume === true ){
            Bolt.Collections.lostContinentCountdownStatus.update(

                {
                    _id: "9ysA4o4hbaJz24kaM"
                },
                {
                    $set: {
                        lowerMuSoundtrackVolume: false
                    }

                }

            );
            var muSoundtrack = document.getElementById("mu-soundtrack");
            muSoundtrack.volume = 0.1;

            // muSoundtrack.currentTime = 0;
            // muSoundtrack.play();
            // muSoundtrack.addEventListener('ended', function() {
            //     this.currentTime = 0;
            //     this.play();
            // }, false);

        }

        // LOWER MU SOUNDTRACK VOLUME
        if( resetDocReactive[0].playLoserAudio === true ){
            Bolt.Collections.lostContinentCountdownStatus.update(

                {
                    _id: "9ysA4o4hbaJz24kaM"
                },
                {
                    $set: {
                        playLoserAudio: false
                    }

                }

            );
            var loserAudio = document.getElementById("mu-loser");
            loserAudio.volume = 1.0;
            loserAudio.currentTime = 0;
            var muSoundtrack = document.getElementById("mu-soundtrack");
            muSoundtrack.pause();
            loserAudio.play();

            // muSoundtrack.currentTime = 0;
            // muSoundtrack.play();
            // muSoundtrack.addEventListener('ended', function() {
            //     this.currentTime = 0;
            //     this.play();
            // }, false);

        }

        console.log( 'PLAY MU SOUNDTRACK?', resetDocReactive[0] );
    });
});

