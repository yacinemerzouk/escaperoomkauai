/**
 * TEMPLATE CREATED
 */
Template.adminGamesCalendar.onRendered(function(){

    // Set first day of calendar UI
    if( !Session.get('firstDay') ){
        Session.set('firstDay', Epoch.dateObjectToDateString(new Date()));
    }

    // Subscribe to rooms data
    Meteor.subscribe(
        'roomsMeta',
        {
            onReady: function(){
                // console.log( 'Calendar: roomsMeta ready' );
            },
            onStop: function(){
                console.log( 'Calendar: roomsMeta FAIL' );
            }
        }
    );

    // Datepicker
    $('[hook="jump-to-date-datepicker"]').datepicker({
        dateFormat: 'yy-mm-dd',
        onSelect: function (dateText, inst) {
            Session.set('firstDay', dateText);
        }
    });
});

/**
 * HELPERS
 */
Template.adminGamesCalendar.helpers({

    /**
     * First day
     * @returns date as string
     */
    firstDay: function(){
        return Session.get('firstDay');
    },

    /**
     * Days
     * @returns Array of date strings
     */
    days: function(){
        var firstDay = Session.get('firstDay');
        var days = [firstDay];

        if( firstDay ) {
            for (var x = 1; x < 5; x++) {
                days.push(Epoch.addDaysToDate(x, firstDay));
            }
        }
        return days;
    }
});

/**
 * EVENTS
 */
Template.adminGamesCalendar.events({
    'click [hook="next-games"]': function (evt, tmpl) {
        evt.preventDefault();
        console.log('next games');
        var currentFirstDay = Session.get('firstDay');
        var newFirstDay = Epoch.addDaysToDate(1, currentFirstDay);
        Session.set('firstDay', newFirstDay);
    },
    'click [hook="prev-games"]': function (evt, tmpl) {
        var currentFirstDay = Session.get('firstDay');
        var newFirstDay = Epoch.addDaysToDate(-1, currentFirstDay);
        Session.set('firstDay', newFirstDay);
    },
    'click [hook="jump-to-date"]': function (evt, tmpl) {
        $('[hook="jump-to-date-datepicker"]').show().focus();
    },
    'click [hook="add-game"]': function( evt, tmpl ){
        evt.preventDefault();
        var date = $(evt.currentTarget).attr('hook-data-date');
        console.log( 'Adding game', date );
        Blaze.renderWithData(Template.calendarFormAddGame,{date:date},$('body')[0]);
    },
    'click [hook="edit-game"]':function(evt,tmpl){
        evt.preventDefault();
        var gameId = $(evt.currentTarget).attr('hook-data-game-id');
        Blaze.renderWithData(Template.calendarFormEditGame,{gameId:gameId},$('body')[0]);
    }
});