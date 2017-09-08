Template.calendarFormEditReservation.onCreated(function(){
    var reservation = new Bolt.Reservation(this.data.publicId);
    Session.set('adminUserSelections', reservation);

    this.updateReservation = function( formData ){

        var formData = formData || Bureaucrat.getFormData( $( '[hook="edit-reservation-form"]' ) );
        var userSelections = Session.get( 'adminUserSelections' ) || {};

        if( formData.coupon ) {
            formData.coupon = formData.coupon.toUpperCase();
        }

        //ok

        Session.set( 'adminUserSelections', _.extend( userSelections, formData ) );
        // console.log( 'UPDATING RES', userSelections, formData );
    }
});
Template.calendarFormEditReservation.events({
    'click [hook="calendar-form-background"]': function(evt,tmpl){
        Blaze.remove(tmpl.view);
    },
    'click [hook="calendar-form-close"]': function(evt,tmpl){
        Blaze.remove(tmpl.view);
    },
    'change [hook="update-reservation"]': function( evt, tmpl ){
        // console.log('In update reservation');
        tmpl.updateReservation();
    },
    'submit [hook="edit-reservation-form"]': function(evt,tmpl){
        evt.preventDefault();
        var formData = Bureaucrat.getFormData($(evt.target));
        var game = new Bolt.Game( formData._id );
        var reservation = new Bolt.Reservation(formData);
        reservation.publicId = tmpl.data.publicId;
        // console.log( 'UPDATE1', tmpl, reservation );
        game.updateReservation(reservation);
        // console.log( 'UPDATE2', game, formData, reservation );
        var saved = game.save();
        if( saved ){
            Notifications.success('Reservation updated.');
            Blaze.renderWithData(Template.calendarFormEditGame,{gameId:game._id},$('body')[0]);
            Blaze.remove(tmpl.view);
        }else{
            Notifications.error('Could not save game.');
        }
    }
});

Template.calendarFormEditReservation.helpers({
    game: function(){
        var game = new Bolt.Game({reservationPublicId:parseInt(this.publicId)});
        return game;
    },
    reservation: function(){
        return new Bolt.Reservation( Session.get('adminUserSelections') );
    }
});