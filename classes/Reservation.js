Bolt.Reservation = function( args ){

    // ID was provided
    if( typeof( args ) == 'string' ){

        // Grab data from DB
        var data = Bolt.Collections.Reservations.findOne( args );

        // Data was provided
    }else if( typeof( args ) == 'object' ){

        // Set properties of object
        var data = args;

        // Nothing provided; throw error
    }else{
        throw new Meteor.Error( 'KER ERROR', 'Cannot create RESERVATION object without data or id.' );
    }

    // Set properties of object
    for (var prop in data) {
        this[prop] = data[prop];
    }

    if( this.room && this.room._id ){
        this.roomId = this.room._id;
    }

    this.populate( data );
}

Bolt.Reservation.prototype.populate = function( data ){

    // Set properties of object
    for (var prop in data) {
        this[prop] = data[prop];
    }

    if( this.nbPlayers ) {
        this.costOfPlayers = ( parseFloat(this.nbPlayers) * parseFloat(this.room.pricePerPlayer) ).toFixed(2);
        this.costOfCloseRoom = this.closeRoom ? ( this.room.priceToClose ).toFixed(2) : 0;
        this.subtotal = ( parseFloat(this.costOfPlayers) + parseFloat(this.costOfCloseRoom) ).toFixed(2);
        if (this.coupon) {
            var couponData = Bolt.Collections.Coupons.findOne({coupon: this.coupon});
            if (couponData) {
                this.couponData = couponData;
            } else {
                this.couponData = false;
            }
        }else{
            this.couponData = false;
        }
        this.discount = this.couponData ? ( parseFloat(this.subtotal) * ( this.couponData.discount / 100 ) ).toFixed(2) : 0;
        this.discountKamaaina = !this.discount && parseInt(this.nbKamaaina) > 0 ? ( parseInt(this.nbKamaaina) * 5 ).toFixed(2) : 0;
        this.taxes = ( ( parseFloat(this.subtotal) - parseFloat(this.discount) - parseFloat(this.discountKamaaina) ) * 0.04166 ).toFixed(2);
        this.total = ( parseFloat(this.subtotal) - parseFloat(this.discount) - parseFloat(this.discountKamaaina) + parseFloat(this.taxes) ).toFixed(2);
    }

}

Bolt.Reservation.prototype.save = function(){

    var result;

    // Got ID; means game is already in DB; update document in DB
    if( this._id ){
        result = this.update();

        // No ID; means trip is not in DB; insert document into DB
    }else{
        result = this.create();
    }

    return result;

}

Bolt.Reservation.prototype.update = function(){

    var result = Bolt.Collections.Reservations.update(
        {
            _id: this._id
        },
        {
            $set: _.omit( this, '_id' )
        }
    );

    return result;

}

Bolt.Reservation.prototype.create = function() {

    var result = Bolt.Collections.Reservations.insert(this);

    if( result ){
        this._id = result;
        return this._id;
    }else{
        return false;
    }

}

Bolt.Reservation.prototype.charge = function(){

    if( Meteor.isClient ){

    }

}

Bolt.Reservation.prototype.sendConfirmationEmail = function(){

    if( Meteor.isClient ){
        var reservation = this;

        Meteor.call(
            'sendEmail',
            reservation.email,
            '"Kauai Escape Room" ' + Meteor.settings.public.smtp.email,
            'Booking confirmation - RESERVATION #' + reservation.publicId,
            Bolt.getConfirmationEmailBody(reservation._id),
            function (error, result) {
                if (error) {
                    throw new Meteor.Error('MAILER_ERROR', 'Error while sending booking confirmation. ERROR ||| RES => ' + JSON.stringify(error));
                }
            }
        );
    }

}

Bolt.Reservation.prototype.sendNotificationEmail = function(){

    if( Meteor.isClient ){

        var reservation = this;
        Meteor.call(
            'sendEmail',
            Meteor.settings.public.smtp.notifications,
            '"Kauai Escape Room" ' + Meteor.settings.public.smtp.mailman,
            'Booking notification - RESERVATION #' + reservation.publicId,
            Bolt.getNotificationEmailBody(reservation._id),
            function (error, result) {
                if (error) {
                    throw new Meteor.Error('MAILER_ERROR', 'Error while sending booking confirmation. ERROR ||| RES => ' + JSON.stringify(error));
                }
            }
        );

    }

}

Bolt.Reservation.prototype.canClose = function(){

    // Get all existing reservations for requested time slot
    var reservations = Bolt.Collections.Reservations.find({
        roomId: this.room._id,
        time: this.time,
        date: this.date
    }).fetch();

    // Calculate how many spots are available before current reservation request
    var spotsLeft = Bolt.spotsLeft(this.room._id, this.date, this.time);

    // Can the room be closed?
    // Rooms can be close if the reservation is the first for a time
    // slot and if the number of players requested
    // is less than the max nb players for the room
    return spotsLeft == this.room.maxPlayers && !(this.room.maxPlayers == this.nbPlayers || this.room.maxPlayers-1 == this.nbPlayers);

}

Bolt.Reservation.prototype.isValid = function(){

    var isValid = true;

    var firstNameOK = this.firstName && this.firstName != '';
    var lastNameOK = this.lastName && this.lastName != '';
    var emailOK = this.email && this.email != '';
    var phoneOK = this.phone && this.phone != '';
    var nbPlayersOK = this.nbPlayers && parseInt( this.nbPlayers ) > 0 ;
    var ccOK = this.cc && this.cc != '';
    var ccExpMonthOK = this.ccExpMonth && this.ccExpMonth != '';
    var ccExpYearOK = this.ccExpYear && this.ccExpYear != '';
    var cvvOK = this.cvv && this.cvv != '';
    // console.log('ok');

    if( !nbPlayersOK ){
        Notifications.error('Missing Info', 'Please select number of players in your party.');
        isValid = false;
    }
    if( !firstNameOK ){
        Notifications.error('Missing Info', 'First name is required.');
        isValid = false;
    }
    if( !lastNameOK ){
        Notifications.error('Missing Info', 'Last name is required.');
        isValid = false;
    }
    if( !emailOK ){
        Notifications.error('Missing Info', 'Email is required.');
        isValid = false;
    }
    if( !phoneOK ){
        Notifications.error('Missing Info', 'Phone number is required.');
        isValid = false;
    }
    if( !ccOK ){
        Notifications.error('Missing Info', 'Credit card number is required.');
        isValid = false;
    }
    if( !ccExpMonthOK ){
        Notifications.error('Missing Info', 'Please select credit card expiration month.');
        isValid = false;
    }
    if( !ccExpYearOK ){
        Notifications.error('Missing Info', 'Please select credit card expiration month.');
        isValid = false;
    }
    if( !cvvOK ){
        Notifications.error('Missing Info', 'Credit card verfication code (CVV) is required.');
        isValid = false;
    }

    return isValid;
}