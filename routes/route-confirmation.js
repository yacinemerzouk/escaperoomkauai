/**
 * Reservation Confirmation
 */
Router.route('/confirmation/:_id', {
    name: 'confirmation',
    // layoutTemplate: 'layoutConfirmation',
    waitOn: function(){
        return [
            Meteor.subscribe('reservation', this.params._id),
            Meteor.subscribe('rooms'),
            Meteor.subscribe('gameByReservationPublicId', this.params._id)
        ]
    },
    data: function(){
        return {
            publicId: this.params._id
        }
    }
});
