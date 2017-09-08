/**
 * Admin Calendar - Admin page
 */
Router.route('/admin/games/calendar', {
    name: 'adminGamesCalendar',
    layoutTemplate: 'layoutAdmin',
    waitOn: function(){
        return [
            Meteor.subscribe( 'roomsMeta' ),
            Meteor.subscribe( 'futureGames' )
        ]
    }
});