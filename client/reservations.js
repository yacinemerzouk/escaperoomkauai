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
        dateFormat: 'yy-mm-dd',
        defaultDate: Session.get( 'adminSelectedDate' ),
        onSelect: function( dateText, inst ){
            $('.ui-state-highlight').removeClass("ui-state-highlight");
            Session.set( 'adminSelectedDate', dateText );
        }
    });
});

Template.reservations.events({
    'click [hook="block-time"]': function(evt,tmpl){
        evt.preventDefault();
        var date = $(evt.target).attr('hook-data-date');
        var time = $(evt.target).attr('hook-data-time');
        var reservations = EscapeRoom.Collections.Reservations.find({
            date:date,
            time:time
        }).fetch();

        var alreadyHasReservations = reservations.length > 0 ? true : false;

        if( !alreadyHasReservations ) {
            var blockId = EscapeRoom.Collections.Reservations.insert({
                blocked: true,
                date: date,
                time: time
            });
        }
        //console.log(blockId);
    },

    'click [hook="unblock-time"]': function(evt,tmpl) {
        evt.preventDefault();
        var date = $(evt.target).attr('hook-data-date');
        var time = $(evt.target).attr('hook-data-time');
        Meteor.call('unblockTime', date, time, function(err,res){
            //console.log('back from unblockTime');
        })
    },

    'click [hook="unblock-date"]': function(evt,tmpl) {
        evt.preventDefault();
        //console.log('unblock?');
        var date = $(evt.target).attr('hook-data-date');
        Meteor.call('unblockDate', date, function(err,res){
            //console.log('back from unblockDate');
        })
    },

    'click [hook="block-date"]': function(evt,tmpl) {
        evt.preventDefault();
        var date = $(evt.target).attr('hook-data-date');

        // Get all time slots
        var possibleTimes = [];
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

        _.each( possibleTimes, function(time){


            var reservations = EscapeRoom.Collections.Reservations.find({
                date:date,
                time:time
            }).fetch();

            var alreadyHasReservations = reservations.length > 0 ? true : false;

            if( !alreadyHasReservations ) {
                // Loop over time slots
                var blockId = EscapeRoom.Collections.Reservations.insert({
                    blocked: true,
                    date: date,
                    time: time
                });
            }
        })

    }
});