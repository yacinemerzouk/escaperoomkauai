/**
 * ON RENDERED
 */
Template.adminGamesCalendarDay.onRendered(function(){
    var date = this.data.date;

});

/**
 * HELPERS
 */
Template.adminGamesCalendarDay.helpers({
    'games': function(){
        var games = Bolt.Collections.Games.find({date:this.date},{sort:{time:1}}).fetch();
        return games;
    },
    'gamesReady': function(){
        var date = this.date;
        return Session.get(date+'GamesReady');
    },
    widthForGames(){
        var nbGames = Bolt.Collections.Games.find({date:this.date},{sort:{time:1}}).count();
        return parseInt(nbGames * 304 - 4) + 'px';
    }
});
