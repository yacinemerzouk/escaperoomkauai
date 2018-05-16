Meteor.methods({
    'populateCalendar': function(){
        if( Meteor.isServer ) {
            var startDate = Epoch.dateObjectToDateString(new Date());
            for (var x = 0; x < 70; x++) {
                var date = Epoch.addDaysToDate(x, startDate);
                if ( date <= "2018-07-08" && Bolt.Collections.Games.find({date: date}).count() === 0) {

                    var dayIndex = Epoch.dateStringToDateObject(date).getDay();

                    // SUNDAY, WEDNESDAY, THURSDAY
                    // 12:45 - KER1 - ANY ROOM
                    // 2:45 - KER1 - ANY ROOM
                    // 4:45 - KER1 - ANY ROOM
                    // 6:45 - KER1 - ANY ROOM
                    if( dayIndex === 0 || dayIndex === 3 || dayIndex === 4 ){

                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "any",
                            date: date,
                            time: "12:00pm"
                        });
                        game.save();

                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "any",
                            date: date,
                            time: "2:00pm"
                        });
                        game.save();

                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "any",
                            date: date,
                            time: "4:00pm"
                        });
                        game.save();

                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "any",
                            date: date,
                            time: "6:00pm"
                        });
                        game.save();

                    }

                    // FRIDAY, SATURDAY
                    // 10:45 - KER1 - ANY ROOM
                    // 12:45 - KER1 - ANY ROOM
                    // 2:45 - KER1 - ANY ROOM
                    // 4:45 - KER1 - ANY ROOM
                    // 6:45 - KER1 - ANY ROOM
                    // 8:45 - KER1 - ANY ROOM
                    if( dayIndex === 5 || dayIndex === 6 ){

                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "any",
                            date: date,
                            time: "10:00am"
                        });
                        game.save();

                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "any",
                            date: date,
                            time: "12:00pm"
                        });
                        game.save();

                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "any",
                            date: date,
                            time: "2:00pm"
                        });
                        game.save();

                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "any",
                            date: date,
                            time: "4:00pm"
                        });
                        game.save();

                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
                            roomId: "any",
                            date: date,
                            time: "6:00pm"
                        });
                        game.save();

                        var game = new Bolt.Game({
                            userId: "9s4urwerA94vLZCMp",
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
