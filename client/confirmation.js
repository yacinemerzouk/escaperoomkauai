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
    }
});