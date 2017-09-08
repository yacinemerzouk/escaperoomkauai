Template.calendarFormAddReservation.onCreated(function(){
    this.updateReservation = function( formData ){

        var formData = formData || Bureaucrat.getFormData( $( '[hook="calendar-reservation-form"]' ) );
        var userSelections = Session.get( 'adminUserSelections' ) || {};

        if( formData.coupon ) {
            formData.coupon = formData.coupon.toUpperCase();
        }

        //ok

        Session.set( 'adminUserSelections', _.extend( userSelections, formData ) );
    }
});
Template.calendarFormAddReservation.helpers({
    game: function(){
        // console.log( 'IN CFAR helper', this );
        return new Bolt.Game(this.gameId);
    },
    reservation: function(){
        return new Bolt.Reservation( Session.get('adminUserSelections') );
    }
});

Template.calendarFormAddReservation.events({
    'change [hook="update-reservation"]': function( evt, tmpl ){
        tmpl.updateReservation();
    },
    'click [hook="calendar-form-background"]': function(evt,tmpl){
        Blaze.remove(tmpl.view);
    },
    'click [hook="calendar-form-close"]': function(evt,tmpl){
        Blaze.remove(tmpl.view);
    },
    'submit [hook="calendar-reservation-form"]': function(evt,tmpl){
        evt.preventDefault();
        var formData = Bureaucrat.getFormData($(evt.target));
        var game = new Bolt.Game( tmpl.data.gameId );
        var reservation = new Bolt.Reservation(formData);
        game.addReservation(reservation)
        var saved = game.save();
        if( saved ){
            Notifications.success('Reservation added.');
            Blaze.renderWithData(Template.calendarFormEditGame,{gameId:game._id},$('body')[0]);
            Blaze.remove(tmpl.view);
        }else{
            Notifications.error('Could not save game.');
        }
    }
});