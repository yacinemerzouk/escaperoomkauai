Template.roomBox.helpers({
    dynamicSuccessRate: function(){
        var games = Bolt.Collections.Games.find( { roomId: this.room._id } ).fetch();
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
        if( nbGames < 10 ) {
            return this.room.successRate;
        }else{
            return Math.ceil(nbGamesWon / nbGames * 100);
        }
    },
    showOpeningDate: function(){
        var today = Epoch.dateObjectToDateString( new Date() );
        console.log( this.room, today );
        if( this.room.openingDate > today ){
            return true
        }else{
            return false
        }
    }
});