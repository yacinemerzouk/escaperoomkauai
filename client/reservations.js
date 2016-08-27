Template.reservations.helpers({
    adminSelectedDate: function(){
        return Session.get('adminSelectedDate');
    },
    games: function(){

        var times = Bolt.getPossibleTimes(Session.get('adminSelectedDate'));
        var games = [];
        _.each(times,function(time){
            var game = new Bolt.Game({
                date: Session.get('adminSelectedDate'),
                time: time
            });
            games.push(game);
        });

        return games;

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
        var reservations = Bolt.Collections.Reservations.find({
            date:date,
            time:time
        }).fetch();

        var alreadyHasReservations = reservations.length > 0 ? true : false;

        if( !alreadyHasReservations ) {
            var blockId = Bolt.Collections.Reservations.insert({
                blocked: true,
                date: date,
                time: time
            });
        }
        ////console.log(blockId);
    },

    'click [hook="unblock-time"]': function(evt,tmpl) {
        evt.preventDefault();
        var date = $(evt.target).attr('hook-data-date');
        var time = $(evt.target).attr('hook-data-time');
        Meteor.call('unblockTime', date, time, function(err,res){
            ////console.log('back from unblockTime');
        })
    },


    'click [hook="send-follow-up"]': function(evt,tmpl) {
        evt.preventDefault();
        var date = Session.get('adminSelectedDate');
        var time = $(evt.currentTarget).attr('hook-data-time');
        var game = new Bolt.Game({date:date,time:time});
        var players = Bureaucrat.getFormData( $(evt.currentTarget).parents('[hook="players-form"]') );
        var playersArray = [];
        _.each(players,function(p){
            if( p && p.length > 0 ) {
                playersArray.push(p);
            }
        });
        //console.log( 'PLAYERS', players, playersArray );
        game.players = playersArray;
        //console.log( 'SENDING FOLLOWUP', game );
        game.sendFollowUpEmail();

    },

    'click [hook="unblock-date"]': function(evt,tmpl) {
        evt.preventDefault();
        ////console.log('unblock?');
        var date = $(evt.target).attr('hook-data-date');
        Meteor.call('unblockDate', date, function(err,res){
            ////console.log('back from unblockDate');
        })
    },

    'click [hook="log-game-result"]': function(evt,tmpl) {
        evt.preventDefault();
        var won = $(evt.currentTarget).attr('hook-data-result') == "won" ? true : false;
        var date = Session.get('adminSelectedDate');
        var time = $(evt.currentTarget).attr('hook-data-time');
        var game = new Bolt.Game({date:date,time:time});
        game.won = won;
        //console.log( 'SAVING GAME', game);
        game.save();
        ////console.log( 'SAVE RES', res );
        // var roomId = $(evt.currentTarget).attr('hook-data-room-id');
        // var date = $(evt.currentTarget).attr('hook-data-date');
        // var time = $(evt.currentTarget).attr('hook-data-time');
        //
        // // Check if game exists
        // var game = Bolt.Collections.Games.findOne(
        //     {
        //         roomId: roomId,
        //         date: date,
        //         time: time
        //     }
        // );
        // if( game ){
        //     Bolt.Collections.Games.update(
        //         {
        //             roomId: roomId,
        //             date: date,
        //             time: time
        //         },
        //         {
        //             won: won
        //         }
        //     );
        // }else{
        //     Bolt.Collections.Games.insert({
        //         won: won,
        //         roomId: roomId,
        //         date: date,
        //         time: time
        //     });
        //
        // }



    },

    'click [hook="block-date"]': function(evt,tmpl) {
        evt.preventDefault();
        var date = $(evt.target).attr('hook-data-date');

        // Get all time slots
        var possibleTimes = Bolt.getPossibleTimes(date);
        // for( var x = 10; x <= 11; x++ ){
        //     possibleTimes.push( x + ':00am' );
        //     possibleTimes.push( x + ':30am' );
        // }
        // possibleTimes.push( '12:00pm' );
        // possibleTimes.push( '12:30pm' );
        // for( var x = 1; x <= 10; x++ ){
        //     possibleTimes.push( x + ':00pm' );
        //     possibleTimes.push( x + ':30pm' );
        // }

        _.each( possibleTimes, function(time){


            var reservations = Bolt.Collections.Reservations.find({
                date:date,
                time:time
            }).fetch();

            var alreadyHasReservations = reservations.length > 0 ? true : false;

            if( !alreadyHasReservations ) {
                // Loop over time slots
                var blockId = Bolt.Collections.Reservations.insert({
                    blocked: true,
                    date: date,
                    time: time
                });
            }
        })

    },
    'click [hook="show-postgame"]': function(evt,tmpl){
        $(evt.currentTarget).siblings('[hook="hide-postgame"]').show();
        $(evt.currentTarget).hide();
        var postgameToShow = $(evt.currentTarget).attr('hook-data');
        $('[hook="postgame-'+postgameToShow+'"]').show();
    },
    'click [hook="hide-postgame"]': function(evt,tmpl){
        $(evt.currentTarget).siblings('[hook="show-postgame"]').show();
        $('[hook="hide-postgame"]').hide();
        var postgameToHide = $(evt.currentTarget).attr('hook-data');
        $('[hook="postgame-'+postgameToHide+'"]').hide();
    },
    'click [hook="log-time"]': function(evt,tmpl){
        evt.preventDefault();
        var timeLog = $(evt.currentTarget).siblings('input').val()
        var date = Session.get('adminSelectedDate');
        var time = $(evt.currentTarget).attr('hook-data-time');
        var game = new Bolt.Game({date:date,time:time});
        game.timeLog = timeLog;
        //console.log( 'SAVING GAME', game);
        game.save();
    }
});