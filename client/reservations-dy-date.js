Template.reservationsByDate.helpers({
    adminDay: function(){
        var adminDay = Bolt.getAdminDay( this.date );
        console.log( 'adminDay helper', adminDay );
        return adminDay;
    }
});

Template.reservationsByDate.onRendered(function(){

    if( ! Session.get( 'adminSelectedDate' ) ){
        Session.set( 'adminSelectedDate', Epoch.dateObjectToDateString( new Date() ) );
    };

    console.log( 'cal', this.data.date );
    $('#datepicker').datepicker({
        dateFormat: 'yy-mm-dd',
        defaultDate: this.data.date,
        onSelect: function( dateText, inst ){
            // $('.ui-state-highlight').removeClass("ui-state-highlight");
            Session.set( 'adminSelectedDate', dateText );
            Router.go( 'reservationsByDate', { date: dateText } );
        }
    });
});

Template.reservationsByDate.events({
    'click [hook="block-time"]': function(evt,tmpl){
        evt.preventDefault();
        var date = $(evt.currentTarget).attr('hook-data-date');
        var time = $(evt.currentTarget).attr('hook-data-time');
        var roomId = $(evt.currentTarget).attr('hook-data-roomid');
        // var reservations = Bolt.Collections.Reservations.find({
        //     date:date,
        //     time:time,
        //     roomId: roomId
        // }).fetch();
        //
        // var alreadyHasReservations = reservations.length > 0 ? true : false;

        var blockId = Bolt.Collections.Reservations.insert({
            blocked: true,
            date: date,
            time: time,
            roomId: roomId
        });
        var gameId = Bolt.Collections.Games.insert({
            date: date,
            time: time,
            roomId: roomId
        });
        // console.log('blocking?', {
        //     date:date,
        //     time:time,
        //     roomId: roomId
        // }, reservations, blockId, gameId);
    },

    'click [hook="unblock-time"]': function(evt,tmpl) {
        evt.preventDefault();
        var date = $(evt.target).attr('hook-data-date');
        var time = $(evt.target).attr('hook-data-time');
        var roomId = $(evt.currentTarget).attr('hook-data-roomid');
        Meteor.call('unblockTime', date, time, roomId, function(err,res){
            //////console.log('back from unblockTime');
        })
    },


    'click [hook="send-follow-up"]': function(evt,tmpl) {
        evt.preventDefault();
        var date = tmpl.data.date;
        var time = $(evt.currentTarget).attr('hook-data-time');
        var game = new Bolt.Game({date:date,time:time});
        var players = Bureaucrat.getFormData( $(evt.currentTarget).parents('[hook="players-form"]') );
        var playersArray = [];
        _.each(players,function(p){
            if( p && p.length > 0 ) {
                playersArray.push(p);
            }
        });
        ////console.log( 'PLAYERS', players, playersArray );
        game.players = playersArray;
        ////console.log( 'SENDING FOLLOWUP', game );
        game.sendFollowUpEmail();

    },

    'click [hook="unblock-date"]': function(evt,tmpl) {
        evt.preventDefault();
        //////console.log('unblock?');
        var date = $(evt.target).attr('hook-data-date');
        Meteor.call('unblockDate', date, function(err,res){
            //////console.log('back from unblockDate');
        })
    },

    'click [hook="log-game-result"]': function(evt,tmpl) {
        evt.preventDefault();
        var won = $(evt.currentTarget).attr('hook-data-result') == "won" ? true : false;
        var date = tmpl.data.date;
        var time = $(evt.currentTarget).attr('hook-data-time');
        var game = new Bolt.Game({date:date,time:time});
        game.won = won;
        ////console.log( 'SAVING GAME', game);
        game.save();
        //////console.log( 'SAVE RES', res );
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
        var date = tmpl.data.date;
        var time = $(evt.currentTarget).attr('hook-data-time');
        var game = new Bolt.Game({date:date,time:time});
        game.timeLog = timeLog;
        ////console.log( 'SAVING GAME', game);
        game.save();
    }
    // 'click [hook="populate-games"]': function(evt,tmpl){
    //     evt.preventDefault();
    //     var reservations = Bolt.Collections.Reservations.find({
    //
    //     }).fetch();
    //     _.each( reservations, function( reservation ){
    //         var gameData = Bolt.Collections.Games.find({
    //             roomId: reservation.roomId,
    //             time: reservation.time,
    //             date: reservation.date
    //         }).fetch();
    //
    //         if( ! gameData || gameData.length == 0 ){
    //             var g;
    //             reservation.roomId = reservation.roomId || "gieyznWfyJMTBWYBT";
    //             if( reservation.date && reservation.time && reservation.roomId){
    //
    //                 console.log( 'GAME DATA', gameData, {
    //                     roomId: reservation.roomId,
    //                     time: reservation.time,
    //                     date: reservation.date
    //                 } );
    //
    //                 g = new Bolt.Game({
    //                     roomId: reservation.roomId,
    //                     time: reservation.time,
    //                     date: reservation.date
    //                 });
    //                 g.save();
    //             }
    //         }
    //     })
    // },
    // 'click [hook="bts"]': function(evt,tmpl){
    //     evt.preventDefault();
    //     var res = Bolt.Collections.Rooms.insert({
    //         "title" : "Halloween: Break The Spell",
    //         "image" : "/images/hero-mobile.jpg",
    //         "opening" : "September 24",
    //         "slug" : "halloween-2016",
    //         "startTimes" : [
    //             "5:00pm",
    //             "7:00pm",
    //             "8:30pm",
    //             "11:00am",
    //             "1:00pm",
    //             "3:00pm"
    //         ],
    //         "duration" : 45,
    //         "pricePerPlayer" : 25,
    //         "priceToClose" : 20,
    //         "minPlayers" : 2,
    //         "maxPlayers" : 6,
    //         "successRate" : 50,
    //         "excerpt" : "An evil spell has been cast. Can you break it?",
    //         "description" : "You are sent to a witch’s lair to acquire the counterspell to an evil charm. The witch is nowhere to be found. Can you discover and cast the counterspell in time?",
    //         "order" : 3,
    //         "kamaainaDiscountPerPlayer" : 5,
    //         "ribbon" : "Book Now",
    //         "available" : true,
    //         "openingDate" : "2016-09-05"
    //     });
    //     console.log( 'INSERT', res );
    // }
});