Meteor.methods({
    'fetchGames': function( date, roomId ){
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
        return games;
    }
});