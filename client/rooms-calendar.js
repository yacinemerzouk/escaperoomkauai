Template.roomsCalendar.helpers({
    days: function(){
        var today = Epoch.dateObjectToDateString( new Date() );
        var days = new ReactiveVar([]) ;
        var daysArray = [];
        daysArray.push( Bolt.getCalendarDay( today ) );
        days = daysArray;

        for( var x = 0; x < 60; x++ ){
            var prevDay = days[ daysArray.length - 1 ];
            var nextDay = Epoch.addDaysToDate(1,prevDay.date);
            days.push( Bolt.getCalendarDay(nextDay) );
        }

        console.log( days );
        return days;
    }
});