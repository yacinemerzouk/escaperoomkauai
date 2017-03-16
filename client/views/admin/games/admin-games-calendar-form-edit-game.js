Template.calendarFormEditGame.onCreated(function(){
    Meteor.subscribe(
        'game',
        this.data.gameId
    );
    Meteor.subscribe('rooms');
});

Template.calendarFormEditGame.onRendered(function(){
    var game = new Bolt.Game( this.data.gameId );
    $('[hook="edit-game-datepicker"]').datepicker({
        dateFormat: 'yy-mm-dd',
        defaultDate: game.date
    });
});
Template.calendarFormEditGame.events({
    'click [hook="calendar-form-background"]': function(evt,tmpl){
        Blaze.remove(tmpl.view);
    },
    'click [hook="cancel-reservation"]': function(evt,tmpl){
        evt.preventDefault();
        var publicId = $(evt.currentTarget).attr('hook-data-id');
        var game = new Bolt.Game({reservationPublicId:publicId});
        game.updateReservation({
            publicId: publicId,
            canceled: true
        });
        var saved = game.save();
        if( saved ){
            Notifications.success('Reservation canceled');
        }else{
            Notifications.error('Could not cancel reservation');
        }
    },
    'click [hook="calendar-form-close"]': function(evt,tmpl){
        Blaze.remove(tmpl.view);
    },
    'click [hook="edit-reservation"]': function(evt,tmpl){
        var publicId = parseInt( $(evt.currentTarget).attr('hook-data-reservation-id') );
        // console.log( 'edit res', publicId );
        Blaze.renderWithData(Template.calendarFormEditReservation,{gameId:tmpl.gameId,publicId:publicId},$('body')[0]);
        Blaze.remove(tmpl.view);
    },
    'click [hook="show-refund"]': function(evt,tmpl){
        evt.preventDefault();
        var transactionId = $(evt.currentTarget).attr('hook-data');
        //console.log( transactionId );
        $('[hook="refund-'+transactionId+'"]').show();
    },
    'click [hook="issue-refund"]': function(evt,tmpl){
        evt.preventDefault();
        var transactionId = $(evt.currentTarget).attr('hook-data');
        var reservationId = $(evt.currentTarget).attr('hook-data-reservation');


        var refundAmount = $('[hook="refund-amount-'+transactionId+'"]').val();

        Bolt.showLoadingAnimation();

        Meteor.call(
            'refund',
            transactionId,
            parseInt( parseFloat( refundAmount ).toFixed(2) * 100 ),
            function( error, response ){
                if( error ){
                    // console.log( error );
                }else{

                    // Get reservation
                    var reservation = new Bolt.Reservation(reservationId);
                    var game = new Bolt.Game({
                        reservationPublicId: reservationId
                    });
                    // Add transaction and Update paid / due
                    // console.log( 'Refund OK', reservation, response );
                    game.addTransaction({
                        reservationPublicId: parseInt( reservationId ),
                        amount: parseFloat( refundAmount * -1 ).toFixed(2),
                        ccTransaction: response
                    })
                    game.save();

                    Bolt.hideLoadingAnimation();

                }
            }
        );
    },
    'submit [hook="edit-game-form"]': function(evt,tmpl){
        evt.preventDefault();
        var formData = Bureaucrat.getFormData( $(evt.target) );
        // console.log( 'EDIT FORM DATA', formData );
        var game = new Bolt.Game( tmpl.data.gameId );
        game.populate(formData);
        var saved = game.save();
        if( saved ){
            Notifications.success('Game updated successfully.');
            Blaze.remove(tmpl.view);
        }
    },
    'click [hook="add-reservation"]': function(evt,tmpl){
        Blaze.renderWithData(Template.calendarFormAddReservation,{gameId:tmpl.data.gameId},$('body')[0]);
        Blaze.remove(tmpl.view);
    },
    'click [hook="add-payment"]': function(evt,tmpl){
        var reservationId = $(evt.currentTarget).attr('hook-data');
        Blaze.renderWithData(Template.calendarFormAddPayment,{reservationId:reservationId},$('body')[0]);
        Blaze.remove(tmpl.view);
    }
});
Template.calendarFormEditGame.helpers({
    gameData: function(){
        return Bolt.Collections.Games.findOne(this.gameId);
    },
    roomsList: function(){
        var game = new Bolt.Game( this.gameId );
        var rooms = Bolt.Collections.Rooms.find({available:true}).fetch();
        for( var x = 0; x < rooms.length; x++ ){
            var room = rooms[x];
            room.isSelected = room._id == game.roomId ? true : false;
        }
        return rooms;
    },
    timesList: function(){
        var game = new Bolt.Game( this.gameId );
        var times = Bolt.getAdminStartTimes();
        var timesList = [];
        for( var x = 0; x < times.length; x++ ){
            var timeItem = {time: times[x]};
            timeItem.isSelected = timeItem.time == game.time ? true : false;
            timesList.push( timeItem );
        }
        return timesList;
    },
    gameMasters: function(){
        return Meteor.users.find({});
    }
});
