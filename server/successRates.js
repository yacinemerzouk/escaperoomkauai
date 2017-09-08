Meteor.methods({

    'getSuccessRates': function(){

        var today = Epoch.dateObjectToDateString(new Date());
        var successRates = {};

        var games = Bolt.Collections.Games.find(
            {},
            {
                fields: {
                    _id: 1,
                    roomId: 1,
                    date: 1,
                    won: 1
                }
            }
        ).fetch();

        _.each(games, function (game) {

            if( game.date <= today && game.roomId && game.roomId != 'any' ){


                if( ! successRates[game.roomId] ){

                    successRates[game.roomId] = {
                        nbGamesPlayed: 0,
                        nbGamesWon: 0
                    };

                }

                var sr = successRates[game.roomId];
                sr.nbGamesPlayed++;
                if( game.won === true ){
                    sr.nbGamesWon++
                }
                sr.successRate = parseInt( Math.floor( ( sr.nbGamesWon / sr.nbGamesPlayed ) * 100 ) );
                successRates[game.roomId] = sr;

            }

        });
        
        return successRates;

    }

});