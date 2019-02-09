if(Bolt.Collections.lostContinentCountdownStatus.find().count() === 0){
    Bolt.Collections.lostContinentCountdownStatus.insert({room:"lc",resetTime:0});
}

Meteor.methods({
    'populateCalendar': function(){
        if( Meteor.isServer ) {
            var startDate = Epoch.dateObjectToDateString(new Date());
            for (var x = 0; x < 90; x++) {
                var date = Epoch.addDaysToDate(x, startDate);
                if ( false && date >= "2019-02-06" && date <= "2019-03-31" && Bolt.Collections.Games.find({date: date}).count() === 0) {

                    var dayIndex = Epoch.dateStringToDateObject(date).getDay();

                    // DAYS
                    // MONDAY:          Yacine  / 12 / 2 / 4 / 6
                    // TUESDAY:         Yacine  / 12 / 2 / 4 / 6
                    // WEDNESDAY:       Yacine  / 10 / 12 / 2 / 4
                    //                  Richard / 6 / 8
                    // THURSDAY:        Tami    / 10 / 12 / 2 / 4
                    //                  Richard / 6 / 8
                    // FRIDAY:          Tami    / 10 / 12 / 2 / 4
                    //                  Richard / 6 / 8
                    // SATURDAY:        Tami    / 10 / 12 / 2
                    //                  Brendon / 4 / 6 / 8
                    // Sunday:          Brendon / 10 / 12 / 2 / 4

                    // Richard sF3w6nZiqbJe8FuCs
                    // Tami jepiv57MpMStyycjr
                    // Yacine LgZ6PWa83zq4k5PTt
                    // Brendon 59yLrCJwbgTCmkToZ

                    // SUNDAYS
                    if(dayIndex === 0) {

                        // Brendon - ANY - 12:00pm
                        var game = new Bolt.Game({
                            userId: "59yLrCJwbgTCmkToZ",
                            roomId: "any",
                            date: date,
                            time: "12:00pm"
                        });
                        game.save();

                        // Brendon - ANY - 2:00pm
                        var game = new Bolt.Game({
                            userId: "59yLrCJwbgTCmkToZ",
                            roomId: "any",
                            date: date,
                            time: "2:00pm"
                        });
                        game.save();

                        // Brendon - ANY - 4:00pm
                        var game = new Bolt.Game({
                            userId: "59yLrCJwbgTCmkToZ",
                            roomId: "any",
                            date: date,
                            time: "4:00pm"
                        });
                        game.save();

                        // Brendon - ANY - 6:00pm
                        var game = new Bolt.Game({
                            userId: "59yLrCJwbgTCmkToZ",
                            roomId: "any",
                            date: date,
                            time: "6:00pm"
                        });
                        game.save();

                    }

                    // MONDAYS AND TUESDAYS
                    if(dayIndex === 1 || dayIndex === 2) {

                        // Yacine - ANY - 12:00pm
                        var game = new Bolt.Game({
                            userId: "LgZ6PWa83zq4k5PTt",
                            roomId: "any",
                            date: date,
                            time: "12:00pm"
                        });
                        game.save();

                        // Yacine - ANY - 2:00pm
                        var game = new Bolt.Game({
                            userId: "LgZ6PWa83zq4k5PTt",
                            roomId: "any",
                            date: date,
                            time: "2:00pm"
                        });
                        game.save();

                        // Yacine - ANY - 4:00pm
                        var game = new Bolt.Game({
                            userId: "LgZ6PWa83zq4k5PTt",
                            roomId: "any",
                            date: date,
                            time: "4:00pm"
                        });
                        game.save();

                        // Yacine - ANY - 6:00pm
                        var game = new Bolt.Game({
                            userId: "LgZ6PWa83zq4k5PTt",
                            roomId: "any",
                            date: date,
                            time: "6:00pm"
                        });
                        game.save();

                    }

                    // WEDNESDAYS
                    if(dayIndex === 3) {

                        // Yacine - ANY - 10:00am
                        var game = new Bolt.Game({
                            userId: "LgZ6PWa83zq4k5PTt",
                            roomId: "any",
                            date: date,
                            time: "10:00am"
                        });
                        game.save();

                        // Yacine - ANY - 12:00pm
                        var game = new Bolt.Game({
                            userId: "LgZ6PWa83zq4k5PTt",
                            roomId: "any",
                            date: date,
                            time: "12:00pm"
                        });
                        game.save();

                        // Yacine - ANY - 2:00pm
                        var game = new Bolt.Game({
                            userId: "LgZ6PWa83zq4k5PTt",
                            roomId: "any",
                            date: date,
                            time: "2:00pm"
                        });
                        game.save();

                        // Yacine - ANY - 4:00pm
                        var game = new Bolt.Game({
                            userId: "LgZ6PWa83zq4k5PTt",
                            roomId: "any",
                            date: date,
                            time: "4:00pm"
                        });
                        game.save();

                        // Richard - ANY - 6:00pm
                        var game = new Bolt.Game({
                            userId: "sF3w6nZiqbJe8FuCs",
                            roomId: "any",
                            date: date,
                            time: "6:00pm"
                        });
                        game.save();

                        // Richard - ANY - 8:00pm
                        var game = new Bolt.Game({
                            userId: "sF3w6nZiqbJe8FuCs",
                            roomId: "any",
                            date: date,
                            time: "8:00pm"
                        });
                        game.save();

                    }

                    // THURSDAYS & FRIDAYS
                    if(dayIndex === 4 || dayIndex === 5) {

                        // Tami - ANY - 10:00am
                        var game = new Bolt.Game({
                            userId: "jepiv57MpMStyycjr",
                            roomId: "any",
                            date: date,
                            time: "10:00am"
                        });
                        game.save();

                        // Tami - ANY - 12:00pm
                        var game = new Bolt.Game({
                            userId: "jepiv57MpMStyycjr",
                            roomId: "any",
                            date: date,
                            time: "12:00pm"
                        });
                        game.save();

                        // Tami - ANY - 2:00pm
                        var game = new Bolt.Game({
                            userId: "jepiv57MpMStyycjr",
                            roomId: "any",
                            date: date,
                            time: "2:00pm"
                        });
                        game.save();

                        // Tami - ANY - 4:00pm
                        var game = new Bolt.Game({
                            userId: "jepiv57MpMStyycjr",
                            roomId: "any",
                            date: date,
                            time: "4:00pm"
                        });
                        game.save();

                        // Richard - ANY - 6:00pm
                        var game = new Bolt.Game({
                            userId: "sF3w6nZiqbJe8FuCs",
                            roomId: "any",
                            date: date,
                            time: "6:00pm"
                        });
                        game.save();

                        // Richard - ANY - 8:00pm
                        var game = new Bolt.Game({
                            userId: "sF3w6nZiqbJe8FuCs",
                            roomId: "any",
                            date: date,
                            time: "8:00pm"
                        });
                        game.save();

                    }

                    // SATURDAYS
                    if(dayIndex === 6) {

                        // Tami - ANY - 10:00am
                        var game = new Bolt.Game({
                            userId: "jepiv57MpMStyycjr",
                            roomId: "any",
                            date: date,
                            time: "10:00am"
                        });
                        game.save();

                        // Tami - ANY - 12:00pm
                        var game = new Bolt.Game({
                            userId: "jepiv57MpMStyycjr",
                            roomId: "any",
                            date: date,
                            time: "12:00pm"
                        });
                        game.save();

                        // Tami - ANY - 2:00pm
                        var game = new Bolt.Game({
                            userId: "jepiv57MpMStyycjr",
                            roomId: "any",
                            date: date,
                            time: "2:00pm"
                        });
                        game.save();

                        // Brendon - ANY - 4:00pm
                        var game = new Bolt.Game({
                            userId: "59yLrCJwbgTCmkToZ",
                            roomId: "any",
                            date: date,
                            time: "4:00pm"
                        });
                        game.save();

                        // Brendon - ANY - 6:00pm
                        var game = new Bolt.Game({
                            userId: "59yLrCJwbgTCmkToZ",
                            roomId: "any",
                            date: date,
                            time: "6:00pm"
                        });
                        game.save();

                        // Brendon - ANY - 8:00pm
                        var game = new Bolt.Game({
                            userId: "59yLrCJwbgTCmkToZ",
                            roomId: "any",
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
