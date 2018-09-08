Template.confirmation.rendered = function(){
    Session.set( 'selectedDate', false );
    Session.set( 'selectedTime', false );
    Session.set('enteredcc',false);
    Session.set('enteredccExpMonth',false);
    Session.set('enteredccExpYear',false);
    Session.set('enteredcvv',false);
}

Template.confirmation.helpers({
    // game: function(){
    //     var gameObject = new Bolt.Game( this.publicId );
    //     console.log( 'GAME', gameObject );
    //     return gameObject;
    // },
    reservation: function(){
        var resObject = new Bolt.Reservation(parseInt(this.publicId));
        var gameObject = new Bolt.Game( {reservationPublicId: parseInt(this.publicId) } );
        resObject.game = gameObject;
        // console.log( 'GAME', gameObject );
        resObject.game = gameObject;
        // console.log( 'RESERVATION', resObject );
        return resObject;
    },
    total: function(){
        return ( this.transaction.amount / 100 ).toFixed(2);
    },
    refund: function(){
        return this.adjustments && this.adjustments.refund ? ( this.adjustments.refund / 100 ).toFixed(2) : false;
    },
    extra: function(){
        return this.adjustments && this.adjustments.extra ? ( this.adjustments.extra / 100 ).toFixed(2) : false;
    },
    correctedAmount: function(){
        return this.adjustments && this.adjustments.correctedAmount ? ( this.adjustments.correctedAmount / 100 ).toFixed(2) : false;
    }
});
