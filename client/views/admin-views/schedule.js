Template.adminSchedule.onRendered(function(){
    if( !Session.get('firstDay') ){
        Session.set('firstDay', Epoch.dateObjectToDateString(new Date()));
    }
});
Template.adminSchedule.helpers({
    days: function(){
        var firstDay = Session.get('firstDay');
        var days = [firstDay];

        if( firstDay ) {
            for (var x = 1; x < 7; x++) {
                days.push(Epoch.addDaysToDate(x, firstDay));
            }
        }
        return days;
    }
});