/**
 * LOST CONTINENT COUNTDOWN PLAYER PAGE
 */
Router.route('/rooms/lost-continent/countdown', {
    name: 'lostContinentCountdown',
    layoutTemplate: 'layoutEmpty',
    waitOn: function(){
        return [
            Meteor.subscribe('lostContinentCountdown')
        ]
    }
});
