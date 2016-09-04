/**
 * Reservation class
 * @param args : Mongo _id or object
 * @constructor
 */
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

    // For backward compat, store both room object and roomId
    if( this.room && this.room._id ){
        this.roomId = this.room._id;
    }

    // Populate this badboy
    this.populate( data );

}

/**
 * Populate - Update multiple attributes at once; only overwrites attributes passed, not entire object data.
 * @param data
 */
Bolt.Reservation.prototype.populate = function( data ){

    // Set properties of object
    for (var prop in data) {
        this[prop] = data[prop];
    }

    // Calculate all costs
    // TODO: Move this somewhere cleaner
    if( this.nbPlayers ) {

        // Total cost of players, before discounts and taxes
        this.costOfPlayers = ( parseFloat(this.nbPlayers) * parseFloat(this.room.pricePerPlayer) ).toFixed(2);

        // Total cost of closing room, before discounts and taxes
        this.costOfCloseRoom = this.closeRoom ? ( this.room.priceToClose ).toFixed(2) : 0;

        // Subtotal
        this.subtotal = ( parseFloat(this.costOfPlayers) + parseFloat(this.costOfCloseRoom) ).toFixed(2);

        // Check coupon
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

        // Discount amount for coupon
        this.discount = this.couponData ? ( parseFloat(this.subtotal) * ( this.couponData.discount / 100 ) ).toFixed(2) : 0;

        // Discount amount for residents
        this.discountKamaaina = !this.discount && parseInt(this.nbKamaaina) > 0 ? ( parseInt(this.nbKamaaina) * 5 ).toFixed(2) : 0;

        // Taxes
        this.taxes = ( ( parseFloat(this.subtotal) - parseFloat(this.discount) - parseFloat(this.discountKamaaina) ) * 0.04166 ).toFixed(2);

        // Total
        this.total = ( parseFloat(this.subtotal) - parseFloat(this.discount) - parseFloat(this.discountKamaaina) + parseFloat(this.taxes) ).toFixed(2);
    }

}

/**
 * Save reservation
 * @returns {*} : reservation ID or false
 */
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

/**
 * Update reservation
 * @returns {any} : Mongo ID or false
 */
Bolt.Reservation.prototype.update = function(){

    var result = Bolt.Collections.Reservations.update(
        {
            _id: this._id
        },
        {
            $set: _.omit( this, ['_id','cc','ccExpMonth','ccExpYear','cvv'] )
        }
    );

    if( result == 0 ){
        throw new Meteor.Error( '[Bolt][Reservation][update] Error', 'No document updated.' );
    }

    return result > 0 ? this._id : false;

}

/**
 * Insert reservation in DB
 * @returns {*}
 */
Bolt.Reservation.prototype.create = function() {

    var result = Bolt.Collections.Reservations.insert(
        _.omit(
            this,
            ['cc','ccExpMonth','ccExpYear','cvv']
        )
    );

    // If insert was successful, we get an ID back
    // Assign ID to object to we don't have to re-generate it
    if( result ){
        this._id = result;
        return this._id;
    }else{
        throw new Meteor.Error( '[Bolt][Reservation][update] Error', 'Could not create document.' );
        return false;
    }

}

/**
 * Send confirmation email
 */
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
                    throw new Meteor.Error( '[Bolt][Reservation][sendConfirmationEmail] Error', 'Error while sending booking confirmation. ||| Error message: ' + error.message + ' ||| Error object: ' + JSON.stringify(error) );
                }
            }
        );
    }

}

/**
 * Send notification to admin
 */
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
                    throw new Meteor.Error( '[Bolt][Reservation][sendNotificationEmail] Error', 'Error while sending notification email to admin. ||| Error message: ' + error.message + ' ||| Error object: ' + JSON.stringify(error) );
                }
            }
        );

    }

}

/**
 * Checks whether the time slot for the reservation can be closed or not
 * @returns {boolean}
 */
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

/**
 * Checks reservation data from order form
 * @returns {boolean}
 */
Bolt.Reservation.prototype.isValid = function(){

    var isValid = true;

    var firstNameOK = this.firstName && this.firstName != '';
    var lastNameOK = this.lastName && this.lastName != '';
    var emailOK = this.email && this.email != '';
    var phoneOK = this.phone && this.phone != '';
    var nbPlayersOK = this.nbPlayers && parseInt( this.nbPlayers ) > 0 ;
    var ccOK = this.total == 0 || this.cc && this.cc != '';
    var ccExpMonthOK = this.total == 0 || this.ccExpMonth && this.ccExpMonth != '';
    var ccExpYearOK = this.total == 0 || this.ccExpYear && this.ccExpYear != '';
    var cvvOK = this.total == 0 || this.cvv && this.cvv != '';

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