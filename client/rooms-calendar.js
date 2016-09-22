Template.roomsCalendar.onCreated(function(){
    Meteor.subscribe('futureReservations'),
    Meteor.subscribe('rooms'),
    Meteor.subscribe('futureGames')

});
Template.roomsCalendar.helpers({
    days: function(){
        var today = Epoch.dateObjectToDateString( new Date() );
        var days = [];
        var daysArray = [];
        daysArray.push( Bolt.getCalendarDay( today ) );
        days = daysArray;

        for( var x = 0; x < 7; x++ ){
            var prevDay = days[ daysArray.length - 1 ];
            var nextDay = Epoch.addDaysToDate(1,prevDay.date);
            days.push( Bolt.getCalendarDay(nextDay) );
        }

        return days;
    }
});

// Template.roomsCalendar.events({
//     'click [hook="set-time"]': function(evt,tmpl){
//         evt.preventDefault();
//         var url = $(evt.currentTarget).attr('href');
//         Session.set( 'selectedTime', $(evt.currentTarget).attr('hook-data') );
//         // console.log( evt, evt.currentTarget );
//         Router.go( url );
//     }
// });