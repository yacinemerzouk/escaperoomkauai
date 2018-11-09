/**
 * LOST CONTINENT COUNTDOWN PLAYER PAGE
 */
Router.route('/rooms/lost-continent/mu-screen', {
    name: 'lostContinentMuScreen',
    layoutTemplate: 'layoutEmpty',
    waitOn: function(){
        return [
            Meteor.subscribe('lostContinentCountdown')
        ]
    }
});
