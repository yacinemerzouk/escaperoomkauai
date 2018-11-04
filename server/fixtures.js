if(Bolt.Collections.lostContinentCountdownStatus.find().count() === 0){
    Bolt.Collections.lostContinentCountdownStatus.insert({room:"lc",resetTime:0});
}

Meteor.methods({
    'populateCalendar': function(){
        if( Meteor.isServer ) {
            var startDate = Epoch.dateObjectToDateString(new Date());
            for (var x = 0; x < 90; x++) {
                var date = Epoch.addDaysToDate(x, startDate);
                if ( date <= "2019-01-06" && date !== "2018-11-22" && date !== "2018-12-25" && date !== "2019-01-01" && Bolt.Collections.Games.find({date: date}).count() === 0) {

                    var dayIndex = Epoch.dateStringToDateObject(date).getDay();

                    // EVERYDAY
                    // 10:00 - KER1 - CURSE OF THE TIKI LOUNGE
                    // 12:00 - KER1 - CURSE OF THE TIKI LOUNGE
                    // 2:00 - KER1 - CURSE OF THE TIKI LOUNGE
                    // 4:00 - KER1 - CURSE OF THE TIKI LOUNGE
                    // 6:00 - KER1 - CURSE OF THE TIKI LOUNGE
                    // 8:00 - KER1 - CURSE OF THE TIKI LOUNGE
                    if( true ){

                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "3uvLANaxBvEfH4ZLH",
                            date: date,
                            time: "10:00am"
                        });
                        game.save();

                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "3uvLANaxBvEfH4ZLH",
                            date: date,
                            time: "12:00pm"
                        });
                        game.save();

                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "3uvLANaxBvEfH4ZLH",
                            date: date,
                            time: "2:00pm"
                        });
                        game.save();

                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "3uvLANaxBvEfH4ZLH",
                            date: date,
                            time: "4:00pm"
                        });
                        game.save();

                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "3uvLANaxBvEfH4ZLH",
                            date: date,
                            time: "6:00pm"
                        });
                        game.save();

                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "3uvLANaxBvEfH4ZLH",
                            date: date,
                            time: "8:00pm"
                        });
                        game.save();

                    }

                    // FRIDAY, SATURDAY
                    // 10:00 - KER1 - ANY ROOM
                    // 12:00 - KER1 - ANY ROOM
                    // 2:00 - KER1 - ANY ROOM
                    // 6:00 - KER1 - ANY ROOM
                    // 8:00 - KER1 - ANY ROOM
                    if( false && (dayIndex === 3 || dayIndex === 4 || dayIndex === 5 || dayIndex === 6 )){

                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "3uvLANaxBvEfH4ZLH",
                            date: date,
                            time: "10:00am"
                        });
                        game.save();

                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "3uvLANaxBvEfH4ZLH",
                            date: date,
                            time: "12:00pm"
                        });
                        game.save();

                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "3uvLANaxBvEfH4ZLH",
                            date: date,
                            time: "2:00pm"
                        });
                        game.save();

                        // var game = new Bolt.Game({
                        //     userId: "9s4urwerA94vLZCMp",
                        //     roomId: "3uvLANaxBvEfH4ZLH",
                        //     date: date,
                        //     time: "4:00pm"
                        // });
                        // game.save();

                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "3uvLANaxBvEfH4ZLH",
                            date: date,
                            time: "6:00pm"
                        });
                        game.save();

                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "3uvLANaxBvEfH4ZLH",
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
