/**
 * ON RENDERED
 */
Template.adminGamesCalendarDay.onRendered(function(){
    var date = this.data.date;
    Meteor.subscribe(
        'games',
        date,
        {
            onReady: function(){
                // console.log( 'Subscription ready for ' + date );
                Session.set(date+'GamesReady',true);
            },
            onStop: function(){
                console.log( 'Subscription error for ' + date );
            }
        }
    )
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
    }
});