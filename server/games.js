Meteor.methods({
    'fetchGames': function( date, roomId ){
        // console.log('METHOD: Fetching game data');
        var tstamp1 = new Date().getTime();
        var games = Bolt.Collections.Games.find({
            date: date,
            $or: [
                {roomId: roomId},
                {roomId: 'any'}
            ]
        }, {
            sort: {time: 1}
        }).fetch();

        _.each(games, function (game) {
            if (game.roomId == 'any') {
                game.roomId = roomId;
            }
        });

        var tstamp2 = new Date().getTime();
        // console.log('METHOD: Game data ready in ' + ( tstamp2 - tstamp1 ) + 'ms');

        return games;
    }
});