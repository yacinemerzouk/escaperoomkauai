Template.roomBox.helpers({
    dynamicSuccessRate: function(){
        var games = Bolt.Collections.Games.find( { roomId: this.room._id } ).fetch();
        console.log('in dynsucrate', this.room._id, games );
        var nbGames = 0;
        var nbGamesWon = 0;
        _.each( games, function( game ) {
            if (game && game.won === true || game.won === false) {
                nbGames++;
                if (game.won) {
                    nbGamesWon++;
                }
            }
        });
        console.log('DYNAMIC SUCCESS RATE', nbGames, nbGamesWon, Math.ceil(nbGamesWon / nbGames * 100));
        if( nbGames < 10 ) {
            return this.room.successRate;
        }else{
            return Math.ceil(nbGamesWon / nbGames * 100);
        }
    }
});