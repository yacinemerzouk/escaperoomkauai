Meteor.methods({
    'populateCalendar': function(){
        if( Meteor.isServer ) {
            var startDate = Epoch.dateObjectToDateString(new Date());
            for (var x = 0; x < 61; x++) {
                var date = Epoch.addDaysToDate(x, startDate);
                if (date != "2017-12-24" && date != "2017-11-23" && date != "2017-12-25" && date != "2017-12-31" && date != "2018-01-15" && Bolt.Collections.Games.find({date: date}).count() === 0) {

                    var dayIndex = Epoch.dateStringToDateObject(date).getDay();

                    // MONDAY
                    // 10:45 - ANY LOCATION - ANY ROOM
                    // 12:45 - ANY LOCATION - ANY ROOM
                    // 2:45 - ANY LOCATION - ANY ROOM
                    // 4:45 - ANY LOCATION - ANY ROOM
                    // 6:45 - KER1 ONLY - ANY ROOM
                    // 8:45 - ANY LOCATION - ANY ROOM

                    // TUESDAY, WEDNESDAY, THURSDAY, FRIDAY
                    // 10:45 - ANY LOCATION - ANY ROOM
                    // 12:45 - ANY LOCATION - ANY ROOM
                    // 2:45 - ANY LOCATION - ANY ROOM
                    // 4:45 - KER1 ONLY - ANY ROOM
                    // 6:45 - ANY LOCATION - ANY ROOM
                    // 8:45 - ANY LOCATION - ANY ROOM

                    // SATURDAY, SUNDAY
                    // 10:45 - ANY LOCATION - ANY ROOM
                    // 12:45 - ANY LOCATION - ANY ROOM
                    // 2:45 - ANY LOCATION - ANY ROOM
                    // 4:45 - ANY LOCATION - ANY ROOM
                    // 6:45 - ANY LOCATION - ANY ROOM
                    // 8:45 - ANY LOCATION - ANY ROOM

                    var game = new Bolt.Game({
                        userId: "RpiLtn28nLk9rHarH",
                        roomId: "any",
                        date: date,
                        time: "10:45am"
                    });
                    game.save();

                    var game = new Bolt.Game({
                        userId: "RpiLtn28nLk9rHarH",
                        roomId: "any",
                        date: date,
                        time: "12:45pm"
                    });
                    game.save();

                    var game = new Bolt.Game({
                        userId: "RpiLtn28nLk9rHarH",
                        roomId: "any",
                        date: date,
                        time: "2:45pm"
                    });
                    game.save();

                    if (dayIndex == 0 || dayIndex == 1 || dayIndex == 6 ) {

                        var game = new Bolt.Game({
                            userId: "RpiLtn28nLk9rHarH",
                            roomId: "any",
                            date: date,
                            time: "4:45pm"
                        });
                        game.save();

                    }else {

                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "any",
                            date: date,
                            time: "4:45pm"
                        });
                        game.save();

                    }

                    if (dayIndex == 0 || dayIndex == 1 || dayIndex == 6 ) {

                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "any",
                            date: date,
                            time: "6:45pm"
                        });
                        game.save();

                    }else {

                        var game = new Bolt.Game({
                            userId: "RpiLtn28nLk9rHarH",
                            roomId: "any",
                            date: date,
                            time: "6:45pm"
                        });
                        game.save();

                    }

                    var game = new Bolt.Game({
                        userId: "RpiLtn28nLk9rHarH",
                        roomId: "any",
                        date: date,
                        time: "8:45pm"
                    });
                    game.save();


                }
            }
        }

    }
});