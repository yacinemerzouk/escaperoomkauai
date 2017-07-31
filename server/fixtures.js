Meteor.methods({
    'populateCalendar': function(){
        if( Meteor.isServer ) {
            var startDate = Epoch.dateObjectToDateString(new Date());
            for (var x = 0; x < 61; x++) {
                var date = Epoch.addDaysToDate(x, startDate);
                if (Bolt.Collections.Games.find({date: date}).count() === 0) {

                    var dayIndex = Epoch.dateStringToDateObject(date).getDay();

                    if (dayIndex == 0 || dayIndex == 5 || dayIndex == 6) {

                        var game = new Bolt.Game({
                            userId: "jepiv57MpMStyycjr",
                            roomId: "any",
                            date: date,
                            time: "10:30am"
                        });
                        game.save();

                        var game = new Bolt.Game({
                            userId: "jepiv57MpMStyycjr",
                            roomId: "any",
                            date: date,
                            time: "12:30pm"
                        });
                        game.save();

                        var game = new Bolt.Game({
                            userId: "jepiv57MpMStyycjr",
                            roomId: "any",
                            date: date,
                            time: "2:30pm"
                        });
                        game.save();

                        var game = new Bolt.Game({
                            userId: "LuC4ngxpdTjEWQ7sK",
                            roomId: "any",
                            date: date,
                            time: "4:30pm"
                        });
                        game.save();

                        var game = new Bolt.Game({
                            userId: "LuC4ngxpdTjEWQ7sK",
                            roomId: "any",
                            date: date,
                            time: "6:30pm"
                        });
                        game.save();

                        var game = new Bolt.Game({
                            userId: "LuC4ngxpdTjEWQ7sK",
                            roomId: "any",
                            date: date,
                            time: "8:30pm"
                        });
                        game.save();


                    }

                    if (dayIndex == 3) {


                        var game = new Bolt.Game({
                            userId: "jepiv57MpMStyycjr",
                            roomId: "any",
                            date: date,
                            time: "12:30pm"
                        });
                        game.save();

                        var game = new Bolt.Game({
                            userId: "jepiv57MpMStyycjr",
                            roomId: "any",
                            date: date,
                            time: "2:30pm"
                        });
                        game.save();

                        var game = new Bolt.Game({
                            userId: "jepiv57MpMStyycjr",
                            roomId: "any",
                            date: date,
                            time: "4:30pm"
                        });
                        game.save();

                        var game = new Bolt.Game({
                            userId: "jepiv57MpMStyycjr",
                            roomId: "any",
                            date: date,
                            time: "6:30pm"
                        });
                        game.save();


                    }

                    if (dayIndex == 4) {


                        var game = new Bolt.Game({
                            userId: "LuC4ngxpdTjEWQ7sK",
                            roomId: "any",
                            date: date,
                            time: "12:30pm"
                        });
                        game.save();

                        var game = new Bolt.Game({
                            userId: "LuC4ngxpdTjEWQ7sK",
                            roomId: "any",
                            date: date,
                            time: "2:30pm"
                        });
                        game.save();

                        var game = new Bolt.Game({
                            userId: "LuC4ngxpdTjEWQ7sK",
                            roomId: "any",
                            date: date,
                            time: "4:30pm"
                        });
                        game.save();

                        var game = new Bolt.Game({
                            userId: "LuC4ngxpdTjEWQ7sK",
                            roomId: "any",
                            date: date,
                            time: "6:30pm"
                        });
                        game.save();


                    }


                }
            }
        }

    }
});