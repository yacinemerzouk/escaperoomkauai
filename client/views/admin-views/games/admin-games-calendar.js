/**
 * =============================================================
 * DATA CONTEXT
 * Template data: none
 * Router subscriptions: none
 * Template subscriptions: none
 * =============================================================
 */

/**
 * =============================================================
 * TEMPLATE CREATED
 * =============================================================
 */
Template.adminGamesCalendar.onCreated(function(){
    // Populate games 60 days in advance
    Meteor.call('populateCalendar',function(e,r){});
});

/**
 * =============================================================
 * TEMPLATE RENDERED
 * =============================================================
 */
Template.adminGamesCalendar.onRendered(function(){
    // Set first day of calendar UI
    if( !Session.get('firstDay') ){
        Session.set('firstDay', Epoch.dateObjectToDateString(new Date()));
    }

    // Datepicker
    $('[hook="jump-to-date-datepicker"]').datepicker({
        dateFormat: 'yy-mm-dd',
        onSelect: function (dateText, inst) {
            Session.set('firstDay', dateText);
        }
    });
});


/**
 * =============================================================
 * TEMPLATE DESTROYED
 * =============================================================
 */
Template.adminGamesCalendar.onDestroyed(function(){});

/**
 * =============================================================
 * TEMPLATE EVENTS
 * =============================================================
 */
Template.adminGamesCalendar.events({
    'click [hook="square-test"]': (event, templateInstance) => {

        // Prevent event default behavior
        event.preventDefault();

        Meteor.call('squareTest', function(error, response){

            console.log('Back from squareTest', error, response);

        });

        Meteor.call('chargeTest', function(error, response){

            console.log('Back from chargeTest', error, response);

        });


    },

    'click [hook="next-games"]': function (evt, tmpl) {
        evt.preventDefault();
        // console.log('next games');
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
        // console.log( 'Adding game', date );
        Blaze.renderWithData(Template.calendarFormAddGame,{date:date},$('body')[0]);
    },
    'click [hook="edit-game"]':function(evt,tmpl){
        evt.preventDefault();
        var gameId = $(evt.currentTarget).attr('hook-data-game-id');
        Blaze.renderWithData(Template.calendarFormEditGame,{gameId:gameId},$('body')[0]);
    },
    /**
     * Load past games
     * @param evt
     * @param tmpl
     */
    'click [hook="load-past-games"]': function(evt,tmpl){

        // Prevent default event behavior
        evt.preventDefault();

        $(evt.currentTarget).hide();
        Bolt.showLoadingAnimation();

        Meteor.subscribe('games',{
            onReady: function(){
                Session.set('pastGamesLoaded');
                Notifications.success('All games were loaded successfully.');
                Bolt.hideLoadingAnimation()
            },
            onStop: function(){
                Notifications.error('Could not load all games.');
                $(evt.currentTarget).show();
                Bolt.hideLoadingAnimation()
            }
        })

    }
});


/**
 * =============================================================
 * TEMPLATE HELPERS
 * =============================================================
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
            for (var x = 1; x < 7; x++) {
                days.push(Epoch.addDaysToDate(x, firstDay));
            }
        }
        return days;
    }
});
