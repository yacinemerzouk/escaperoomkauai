/**
 * Waivers
 */
Router.route('/waiver', {
    name: 'waiver',
    layoutTemplate: 'layoutEmpty',
    waitOn: function(){
        return [
            Meteor.subscribe( 'roomsMeta' ),
            Meteor.subscribe( 'games', Epoch.today() )
        ]
    }
});