/**
 * Game management
 */
Router.route('/game/play/:_id', {
    name: 'gamePlay',
    layoutTemplate: 'layoutAdmin',
    waitOn: function(){
        var game = new Bolt.Game(this.params._id);
        // console.log( 'waiton...', game );
        return [
            Meteor.subscribe( 'game', this.params._id ),
            Meteor.subscribe( 'roomById', game.roomId ),
            Meteor.subscribe( 'tikiCountdown' ),
            Meteor.subscribe( 'seanceCountdown' ),
        ]
    },
    data: function(){
        return {_id:this.params._id}
    }
});