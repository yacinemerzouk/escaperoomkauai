
Template.roomsCalendar.onRendered(function(){

    fbq('track', 'Search');

    if( !Session.get('calendarDay') ) {
        Session.set('calendarDay', Epoch.dateObjectToDateString(new Date()));
        // console.log( 'SETTING CALENDAR DAY', Epoch.dateObjectToDateString(new Date()) );
    }else{
        // console.log( 'CALENDAR DAY ALREADY SET', Session.get('calendarDay') );
    }

    this.autorun(function() {

        Session.set('calendarReservationsReady',false);
        Session.set('calendarGamesReady',false);

        Meteor.subscribe(
            'reservations',
            Session.get('calendarDay'),
            {
                onReady: function () {
                    // console.log('reservations ready');
                    Session.set('calendarReservationsReady', true);
                }
            }
        );
        Meteor.subscribe(
            'games',
            Session.get('calendarDay'),
            {
                onReady: function () {
                    // console.log('games ready');
                    Session.set('calendarGamesReady', true);
                }
            }
        );
    });
});
Template.roomsCalendar.helpers({
    // days: function(){
    //     var today = Epoch.dateObjectToDateString( new Date() );
    //     var days = [];
    //     var daysArray = [];
    //     daysArray.push( Bolt.getCalendarDay( today ) );
    //     days = daysArray;
    //
    //     for( var x = 0; x < 7; x++ ){
    //         var prevDay = days[ daysArray.length - 1 ];
    //         var nextDay = Epoch.addDaysToDate(1,prevDay.date);
    //         days.push( Bolt.getCalendarDay(nextDay) );
    //     }
    //     console.log( 'DAYS', days );
    //     return days;
    // },
    day: function(){
        var day = Bolt.getCalendarDay( Session.get('calendarDay') );
        if( Session.get('calendarReservationsReady') && Session.get('calendarGamesReady') ){
            // console.log( 'Everything ready; returning day', day );
            return day;
        }else{
            // console.log( 'Everything NOT ready; returning false' );
            return false;
        }
    },
    canBeBooked: function( gameData ){
        var game = new Bolt.Game( gameData );
        return game.canBeBooked( 0 );
    },
    calculateSpotsLeft: function( gameData ){
        var game = new Bolt.Game( gameData );
        return game.getNbAvailableSpots();
    }
});

Template.roomsCalendar.events({
    'click [hook="set-time"]': function(evt,tmpl){
        evt.preventDefault();
        var date = $(evt.currentTarget).attr('hook-data-date');
        var time = $(evt.currentTarget).attr('hook-data-time');
        var roomId = $(evt.currentTarget).attr('hook-data-room-id');
        var room = new Bolt.Room(roomId);
        Session.set('userSelections', {date:date,time:time,roomId:roomId});
        // console.log('CALENDAR ROOM',room);
        // Session.set( 'selectedTimeFromCalendar', $(evt.currentTarget).attr('hook-data') );
        // console.log( "SETTING TIME FOR CALENDAR", evt.currentTarget );
        // Router.go( url );
        Router.go('room',{slug:room.slug});
    },
    'click [hook="add-day"]': function(evt,tmpl){
        // console.log(Session.get('calendarDay'),'Adding 1 day',Epoch.addDaysToDate(1, Session.get('calendarDay')));
        evt.preventDefault();
        var updatedCalendarDay = Epoch.addDaysToDate(1, Session.get('calendarDay'));
        Session.set( 'calendarDay', updatedCalendarDay );
    },
    'click [hook="subtract-day"]': function(evt,tmpl){
        // console.log(Session.get('calendarDay'),'Adding -1 day',Epoch.addDaysToDate(-1,Session.get('calendarDay')));
        evt.preventDefault();
        var updatedCalendarDay = Epoch.addDaysToDate(-1,Session.get('calendarDay'));
        Session.set( 'calendarDay', updatedCalendarDay );
    }
});