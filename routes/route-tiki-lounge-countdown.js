/**
 * TIKI COUNTDOWN PLAYER PAGE
 */
Router.route('/rooms/tiki-lounge/countdown', {
    name: 'tikiCountdown',
    layoutTemplate: 'layoutEmpty',
    waitOn: function(){
        return [
            Meteor.subscribe('tikiCountdown')
        ]
    }
});