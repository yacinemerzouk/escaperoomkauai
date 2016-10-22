Template.reservationsCreate.helpers({
    startTimes: function(){
        return Bolt.getAdminStartTimes();
    },
    rooms: function(){
        return Bolt.Collections.Rooms.find({
            available:true
        });
    }
});

Template.reservationsCreate.onRendered(function(){
    $('#datepicker').datepicker({
        dateFormat: 'yy-mm-dd'
    });
});

Template.reservationsCreate.events({
    'submit form': function(evt,tmpl){
        evt.preventDefault();
        var formData = Bureaucrat.getFormData($('form'));
        console.log( formData );
        Meteor.call(
            'adminCreateReservation',
            formData,
            function( error, response ){
                if( error ) {
                    throw new Meteor.Error('reservationsCreate|submit form');
                }else{
                    console.log( 'RESPONSE', response );
                    if( response === true ){
                        Notifications.success(
                            "Reservation created",
                            "DON'T FORGET TO BLOCK OTHER GAMES AT THE SAME TIME SLOT."
                        )
                    }else{
                        Notifications.error(
                            "Error",
                            response
                        );
                    }
                }
            }
        );
    }
});