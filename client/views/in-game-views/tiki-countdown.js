Template.tikiCountdown.onCreated(function(){
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
                self.timer = setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
                if( secs == 50 ){
                    document.getElementById('news').innerHTML = "COULD SINK TIKI ISLAND";
                }else if( secs == 40 ){
                    document.getElementById('news').innerHTML = "ERUPTION TO TRIGGER CHAIN REACTION";
                }else if( secs == 30 ){
                    document.getElementById('news').innerHTML = "AND CAUSE MORE VOLCANO ERUPTIONS";
                }else if( secs == 20 ){
                    document.getElementById('news').innerHTML = "ALL ACROSS PACIFIC RIM";
                }else if( secs == 10 ){
                    document.getElementById('news').innerHTML = "1 BILLION PEOPLE COULD DIE!";
                }else{
                    document.getElementById('news').innerHTML = document.getElementById('news').innerHTML + ".";
                }
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
Template.tikiCountdown.onRendered(function(){
    // this.lastReset = Session.get('lastReset');
    // setTimeout("this.checkLastReset()",1000);
    // this.countdown();

    // console.log('...');
    // var resetDoc = Bolt.Collections.tikiCountdownStatus.find();
    //
    // Session.set('lastReset',resetDoc.resetTime);
    // this.countdown();
    // var self = this;
    // this.autorun(function(){
    //     var resetDocReactive = Bolt.Collections.tikiCountdownStatus.find().fetch();
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

        var resetDocReactive = Bolt.Collections.tikiCountdownStatus.find().fetch();
        var lastResetTime = resetDocReactive[0].resetTime;
        var dateObject = new Date();
        var currentTime = dateObject.getTime();
        var secondsSinceLastReset = parseInt(( currentTime - lastResetTime ) / 1000);
        console.log('SECONDS SINCE LAST RESET', secondsSinceLastReset);
        if (secondsSinceLastReset < 3600) {
            var secondsLeftOnCountdown = 3600 - secondsSinceLastReset;
            var countdownSeconds = secondsLeftOnCountdown % 60;
            var countdownMinutes = parseInt(Math.floor(secondsLeftOnCountdown / 60));
            self.countdown("countdown", countdownMinutes, countdownSeconds);
        }
    });
});

