/**
 * SEANCE COUNTDOWN PLAYER PAGE
 */
Router.route('/rooms/seance/countdown', {
    name: 'seanceCountdown',
    layoutTemplate: 'layoutEmpty',
    waitOn: function(){
        var countdownData = Bolt.Collections.seanceCountdownStatus.find().fetch();
        return [
            Meteor.subscribe('seanceCountdown'),
            Meteor.subscribe( 'game', countdownData[0].gameId ),
        ]
    }
});