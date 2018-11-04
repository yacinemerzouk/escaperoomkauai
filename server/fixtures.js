if(Bolt.Collections.lostContinentCountdownStatus.find().count() === 0){
    Bolt.Collections.lostContinentCountdownStatus.insert({room:"lc",resetTime:0});
}

Meteor.methods({
    'populateCalendar': function(){
        if( Meteor.isServer ) {
            var startDate = Epoch.dateObjectToDateString(new Date());
            for (var x = 0; x < 90; x++) {
                var date = Epoch.addDaysToDate(x, startDate);
                if ( date < "2019-01-01" && date !== "2018-11-22" && date !== "2018-12-25" && date !== "2019-01-01" && Bolt.Collections.Games.find({date: date}).count() === 0) {

                    var dayIndex = Epoch.dateStringToDateObject(date).getDay();

                    // DAYS
                    // NOT SUNDAY - 10:00 - KER1 - QUEST FOR THE LOST CONTINENT
                    // NOT SUNDAY - 10:00 - KER1 - CURSE OF THE TIKI LOUNGE
                    // 10:00 - KER1 - CURSE OF THE TIKI LOUNGE
                    // 12:00 - KER1 - QUEST FOR THE LOST CONTINENT
                    // 12:00 - KER1 - CURSE OF THE TIKI LOUNGE
                    // 2:00 - KER1 - QUEST FOR THE LOST CONTINENT
                    // 2:00 - KER1 - CURSE OF THE TIKI LOUNGE
                    // 4:00 - KER1 - QUEST FOR THE LOST CONTINENT
                    // 4:00 - KER1 - CURSE OF THE TIKI LOUNGE
                    // 6:00 - KER1 - QUEST FOR THE LOST CONTINENT
                    // 6:00 - KER1 - CURSE OF THE TIKI LOUNGE
                    // NOT SUNDAY - 8:00 - KER1 - QUEST FOR THE LOST CONTINENT
                    // NOT SUNDAY - 8:00 - KER1 - CURSE OF THE TIKI LOUNGE


                    if(dayIndex !== 0) {


                        // TIKI 10:00am
                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "3uvLANaxBvEfH4ZLH",
                            date: date,
                            time: "10:00am"
                        });
                        game.save();

                        // LOST CONTINENT 10:00am
                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "WWXZxGLGvpr7NBRbf",
                            date: date,
                            time: "10:00am"
                        });
                        game.save();
                    }

                        // TIKI 12:00pm
                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "3uvLANaxBvEfH4ZLH",
                            date: date,
                            time: "12:00pm"
                        });
                        game.save();

                        // LOST CONTINENT 12:00pm
                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "WWXZxGLGvpr7NBRbf",
                            date: date,
                            time: "12:00pm"
                        });
                        game.save();

                        // TIKI 2:00pm
                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "3uvLANaxBvEfH4ZLH",
                            date: date,
                            time: "2:00pm"
                        });
                        game.save();

                        // LOST CONTINENT 2:00pm
                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "WWXZxGLGvpr7NBRbf",
                            date: date,
                            time: "2:00pm"
                        });
                        game.save();

                        // TIKI 4:00pm
                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "3uvLANaxBvEfH4ZLH",
                            date: date,
                            time: "4:00pm"
                        });
                        game.save();

                        // LOST CONTINENT 4:00pm
                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "WWXZxGLGvpr7NBRbf",
                            date: date,
                            time: "4:00pm"
                        });
                        game.save();

                        // TIKI 6:00pm
                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "3uvLANaxBvEfH4ZLH",
                            date: date,
                            time: "6:00pm"
                        });
                        game.save();

                        // LOST CONTINENT 6:00pm
                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "WWXZxGLGvpr7NBRbf",
                            date: date,
                            time: "6:00pm"
                        });
                        game.save();

                    if(dayIndex !== 0) {
                        // TIKI 8:00pm
                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "3uvLANaxBvEfH4ZLH",
                            date: date,
                            time: "8:00pm"
                        });
                        game.save();

                        // LOST CONTINENT 8:00pm
                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "WWXZxGLGvpr7NBRbf",
                            date: date,
                            time: "8:00pm"
                        });
                        game.save();
                    }


                }
            }
        }

    }
});
