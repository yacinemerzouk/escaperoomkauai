Template.reservations.helpers({
    adminSelectedDate: function(){
        return Session.get('adminSelectedDate');
    },
    times: function(){
        var possibleTimes = [];
        var times = [];
        var reservations = EscapeRoom.Collections.Reservations.find( {date: Session.get( 'adminSelectedDate' )}).fetch();
        for( var x = 10; x <= 11; x++ ){
            possibleTimes.push( x + ':00am' );
            possibleTimes.push( x + ':30am' );
        }
        possibleTimes.push( '12:00pm' );
        possibleTimes.push( '12:30pm' );
        for( var x = 1; x <= 10; x++ ){
            possibleTimes.push( x + ':00pm' );
            possibleTimes.push( x + ':30pm' );
        }

        _.each( possibleTimes, function( possibleTime ){

            var time = { time: possibleTime, reservations: [] };

            _.each( reservations, function( reservation ){

                if( possibleTime == reservation.time ){
                    time.reservations.push( reservation );
                }

            })

            times.push( time );

        });



        return times;
    }
});

Template.reservations.onRendered(function(){

    if( ! Session.get( 'adminSelectedDate' ) ){
        Session.set( 'adminSelectedDate', Epoch.dateObjectToDateString( new Date() ) );
    };

    $('#datepicker').datepicker({
        minDate: 0,
        dateFormat: 'yy-mm-dd',
        defaultDate: Session.get( 'adminSelectedDate' ),
        onSelect: function( dateText, inst ){
            $('.ui-state-highlight').removeClass("ui-state-highlight");
            Session.set( 'adminSelectedDate', dateText );
        }
    });
});