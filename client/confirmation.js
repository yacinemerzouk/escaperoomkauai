Template.confirmation.rendered = function(){
    Session.set( 'selectedDate', false );
    Session.set( 'selectedTime', false );
    Session.set('enteredcc',false);
    Session.set('enteredccExpMonth',false);
    Session.set('enteredccExpYear',false);
    Session.set('enteredcvv',false);
}

Template.confirmation.helpers({
    total: function(){
        return ( this.transaction.amount / 100 ).toFixed(2);
    },
    refund: function(){
        return this.adjustments && this.adjustments.refund ? ( this.adjustments.refund / 100 ).toFixed(2) : false;
    },
    correctedAmount: function(){
    return this.adjustments && this.adjustments.correctedAmount ? ( this.adjustments.correctedAmount / 100 ).toFixed(2) : false;
}
});