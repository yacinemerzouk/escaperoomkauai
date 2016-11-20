Template.reportsTransactionsList.helpers({
    reportsTransactionsListFrom: function(){
        return Session.get('reportsTransactionsListFrom');
    },
    reportsTransactionsListTo: function(){
        return Session.get('reportsTransactionsListTo');
    },
    reservations: function(){

        var args = {
            blocked: {
                $ne: true
            }
        };

        var from = Session.get('reportsTransactionsListFrom');
        var fromTimestamp
        var to = Session.get('reportsTransactionsListTo');
        var toTimestamp;

        if( from && to ){
            fromTimestamp = Epoch.dateStringToDateObject( from ).getTime() / 1000;
            toTimestamp = Epoch.dateStringToDateObject( Epoch.addDaysToDate(1,to) ).getTime() / 1000;
            args = {
                $and: [
                    {
                        blocked: {
                            $ne: true
                        }
                    },
                    {
                        "transaction.created": {
                            $gte: fromTimestamp
                        }
                    },
                    {
                        "transaction.created": {
                            $lte: toTimestamp
                        }
                    }
                ]

            }
        }else if( from ){
            // console.log( Epoch.dateStringToDateObject( from ) );
        }else if( to ){
            // console.log( Epoch.dateStringToDateObject( to ) );
        }

        return Bolt.Collections.Reservations.find(
            args
        ).fetch().reverse();
    }
});

Template.reportsTransactionsList.onRendered(function(){
    $('#datepickerFrom').datepicker({
        dateFormat: 'yy-mm-dd',
        defaultDate: Session.get( 'reportsTransactionsListFrom' ),
        onSelect: function( dateText, inst ){
            $('.ui-state-highlight').removeClass("ui-state-highlight");
            Session.set( 'reportsTransactionsListFrom', dateText );
        }
    });
    $('#datepickerTo').datepicker({
        dateFormat: 'yy-mm-dd',
        defaultDate: Session.get( 'reportsTransactionsListTo' ),
        onSelect: function( dateText, inst ){
            $('.ui-state-highlight').removeClass("ui-state-highlight");
            Session.set( 'reportsTransactionsListTo', dateText );
        }
    });
});

Template.reportsTransactionsList.events({
    'change #datepickerFrom': function(evt, tmpl){
        if( evt.currentTarget.value == '' ){
            Session.set( 'reportsTransactionsListFrom', false );
        }
    },
    'change #datepickerTo': function(evt, tmpl){
        if( evt.currentTarget.value == '' ){
            Session.set( 'reportsTransactionsListTo', false );
        }
    },
    'click [hook="resend-confirmation"]': function( evt, tmpl ){
        evt.preventDefault();
        var resId = $(evt.currentTarget).attr('hook-data');
        var res = new Bolt.Reservation( resId );
        // if( res.sendConfirmationEmail() ){
        //TODO: do a real callback before displaying success message; right not this is here so the game master don't send the email a bunch of times in a row.
        Notifications.success( "Confirmation re-sent" );
        // }else{
        //     Notifications.error( "ERROR", "Confirmation NOT re-sent. Contact webmaster" );
        // }
    }
});