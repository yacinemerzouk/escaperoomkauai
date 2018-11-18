    /**
 * Game class
 * @param args : MongoDB ID or object
 * @constructor
 * TODO: clean up when we grab data from DB and when we create object from data
 */
Bolt.Game = function( args ){

    var data;

    // ID was provided
    if( typeof( args ) == 'string' ){

        // Grab data from DB
        data = Bolt.Collections.Games.findOne( args );
        // console.log( 'string', data );

    // Data was provided
    }else if( typeof( args ) == 'object' && args.date && args.roomId ){

        if( args.time ) {
            // Set properties of object with db data or straight up data
            var game = Bolt.Collections.Games.findOne({roomId: args.roomId, date: args.date, time: args.time});
            if (game) {
                data = game;
            } else {
                data = args;
            }
        }else {
            data = args;
        }

        // Nothing provided; throw error
    }else if( typeof( args ) == 'object' && args.reservationPublicId  ){

        data = Bolt.Collections.Games.findOne({"reservations.publicId": parseInt( args.reservationPublicId ) });
        //console.log( 'Building Game from resId',  args, data );
        // Nothing provided; throw error
    }else{
        throw new Meteor.Error( '|Bolt|Game|constructor', 'Cannot create GAME object without data or id.' );
    }

    // Set properties of object
    this.populate(data);

}

/**
* Populate - Update multiple attributes at once; only overwrites attributes passed, not entire object data.
* @param data
*/
Bolt.Game.prototype.populate = function( data ){

    // Set properties of object
    for (var prop in data) {
        this[prop] = data[prop];
    }

}

/**
 * Save game
 * @returns {*} : _id of document or false
 */
Bolt.Game.prototype.save = function(){

    var result;

    var dataToSave = {
        roomId: this.roomId,
        userId: this.userId,
        date: this.date,
        time: this.time,
        blocked: this.blocked ? true : false,
        messages: this.messages ? this.messages : [],
        notes: this.notes || "",
        timeLog: this.timeLog ? this.timeLog : "",
        players: this.players ? this.players : [],
        followUpEmailSent: this.followUpEmailSent ? this.followUpEmailSent : false,
        reservations: this.reservations || []
    };
    if( this.won === true || this.won === false ){
        dataToSave.won = this.won;
    }

    // Got ID; means game is already in DB; update document in DB
    if( this._id ){

        result = this.update( dataToSave );

    // No ID; means trip is not in DB; insert document into DB
    }else{

        // Check for "any" game
        var gameCheck = new Bolt.Game({
            roomId: 'any',
            date: this.date,
            time: this.time
        });
        if( gameCheck._id ){
            this._id = gameCheck._id;
            result = this.update(dataToSave);
        }else{
            result = this.create( dataToSave );
        }


    }
    return result;

}

/**
 * Update game
 * @returns {any} : _id of document or false
 *
 * Never use this function directly; use save() instead.
 */
Bolt.Game.prototype.update = function( dataToSave ){

    // Update DB
    var result = Bolt.Collections.Games.update(
        {
            _id: this._id
        },
        {
            $set: _.omit( dataToSave, '_id' )
        }
    );

    // If number of rows update is 0, throw error
    if( result == 0 ){
        throw new Meteor.Error( '[Bolt][Game][update] Error', 'No document updated.' );
    }

    // Return ID or false
    return result > 0 ? this._id : false;

}


/**
 * Delete game
 * @returns bool
 *
 * Delete game
 */
Bolt.Game.prototype.remove = function(){

    return  Bolt.Collections.Games.remove({_id: this._id});

}



/**
 * Create game
 * @returns {*} : _id of document or false
 *
 * Never use this function directly; use save() instead.
 */
Bolt.Game.prototype.create = function( dataToSave ) {

    // Insert in DB
    var result = Bolt.Collections.Games.insert( dataToSave );

    // If insert was successful, we get an ID back
    // Assign ID to object to we don't have to re-generate it
    if( result ){
        this._id = result;
        return this._id;

    // Throw error if insert failed
    }else{
        throw new Meteor.Error( '[Bolt][Game][create] Error', 'Could not insert document.' );
        return false;
    }

}

/**
 * Add player
 * @param player object with 2 properties: name, email
 */
Bolt.Game.prototype.addPlayer = function( player ){

    // Create players array if it doesn't exist
    if( !this.players ){
        this.players = [];
    }

    // Add player to array
    this.players.push( player );

}

/**
 * Add multiple players
 * @param players
 */
Bolt.Game.prototype.addPlayers = function( players ){

    // Get game var to avoid scope issues
    var game = this;

    // Loop over array
    _.each( players, function( player ){

        // Add player
        game.addPlayer( player );

    });
}

/**
 * Send follow-up email to all players in the game
 */
Bolt.Game.prototype.sendFollowUpEmail = function(){

    // CLIENT ONLY
    if( Meteor.isClient ) {

        // Grab copy of this to avoid scope issues
        var game = this;
        // Email vars
        var to;
        var emailArray = [];

        // If we have a valid game, with at least 1 player
        if (game._id && game.players && game.players.length > 0) {

            // Grab email of each player
            _.each(this.players, function(player){
                emailArray.push(player.email);
            });

            // Send follow-up message to all email addresses
            // join() concatenates all values in array; comma-separated.
            Meteor.call(
                'sendEmail',
                emailArray.join(),                                          // To
                'Kauai Escape Room <info@escaperoomkauai.com>',             // From
                'How did you like your Kauai Escape Room experience?',      // Subject
                Bolt.getFollowUpEmailBody(),                                // Message body
                function (err, res) {

                    // If error, log and notify user
                    if (err) {
                        Notifications.error('Error', 'Could not send email. Please contact webmaster.');
                        throw new Meteor.Error( '[Bolt][Game][sendFollowUpEmail] Error', 'Error message: ' + err.message );

                    // If response OK, update game in DB and notify user
                    } else {
                        game.followUpEmailSent = true;
                        game.save();
                        Notifications.success('Email sent', 'Email sent to ' + emailArray.join());
                    }
                }
            );

        // Game not valid (no players)
        }else{
            Notifications.error('Error', 'Could not send email. Please contact webmaster.');
            throw new Meteor.Error( '[Bolt][Game][sendFollowUpEmail] Error', 'No game ID or no players.' );
        }
    }
}

/**
 * Get nb of players in game; adds up nb of players from all reservations in game
 * @returns {number}
 */
Bolt.Game.prototype.getNbPlayers = function(){

    // Start with 0 players
    var nbPlayers = 0;

    // If there's at least 1 reservation
    if( this.reservations && this.reservations.length > 0 ){

        // Loop over reservations
        _.each(this.reservations,function(reservation){

            if( reservation.canceled !== true ) {
                // Add number of players
                nbPlayers = nbPlayers + parseInt(reservation.nbPlayers);
            }
        });
    }

    // Return number of players
    return nbPlayers;

}

/**
 * Get nb of available player spots left for game; subtracts nb of players from all reservations in game from max players for room
 * @returns {number}
 */
Bolt.Game.prototype.getNbAvailableSpots = function(){
    var room = new Bolt.Room( this.roomId );
    // console.log('getting nb avail spots', this.roomId, this.getNbPlayers() );
    return parseInt( room.maxPlayers ) - this.getNbPlayers();
}

Bolt.Game.prototype.canBeClosed = function( nbPlayers ){
    if( !nbPlayers ){
        return false;
    }
    if( this.reservations && this.reservations.length != 0 ){
        return false;
    }
    var room = new Bolt.Room( this.roomId );
    if( nbPlayers >= room.maxPlayers - 1 ){
        return false;
    }

    return true;

}

Bolt.Game.prototype.canBeBooked = function( nbPlayers ){
    // console.log( 'canBeBooked', this );

    if( this.blocked ){
        return false;
    }

    var room = new Bolt.Room( this.roomId );
    if( !this.reservations || this.reservations.length == 0 ){
        return true;
    }else if( this.reservations.length > 0 ) {
        // console.log( 'IN RES ARRAY' );
        var closeRoom = false;
        var totalPlayers = this.getNbPlayers();
        _.each( this.reservations, function( reservation ){
            if( reservation.closeRoom ){
                closeRoom = true;
            }
        });
        // console.log( 'IN RES ARRAY', closeRoom, totalPlayers, room.maxPlayers );
        // if( closeRoom || totalPlayers >= room.maxPlayers - 1 ){
        if( totalPlayers > 0 ){
            return false;
        }else{
            return true;
        }
    }else{
        return false;
    }



}

Bolt.Game.prototype.addReservation = function( reservation ){
    if( !this.reservations ){
        this.reservations = [];
    }
    if(!reservation.publicId){
        reservation.publicId = reservation.publicId || Math.floor(10000000 + Math.random() * 90000000);
    }
    if(!reservation.paid){
        reservation.paid = 0;
    }
    if(!reservation.due){
        reservation.due = parseFloat( reservation.total ).toFixed(2);
    }
    this.reservations.push(
        _.pick(
            reservation,
            'publicId',
            'roomId',
            'nbPlayers',
            'date',
            'time',
            'firstName',
            'lastName',
            'email',
            'phone',
            'closeRoom',
            'nbKamaaina',
            'source',
            'room',
            'total',
            'transactions',
            'due',
            'paid',
            'coupon',
        )
    );
    return reservation.publicId;
}

Bolt.Game.prototype.updateReservation = function( args ){
    var publicId = args.publicId;

    _.each( this.reservations, function( reservation ){
        if( reservation.publicId == publicId ){
            // console.log( 'RESERVATION BEFORE UPDATE', reservation );
            // console.log( 'DATA FOR UPDATE', args );
            reservation = _.extend( reservation, args );
            reservation.due = ( parseFloat( reservation.total ) - parseFloat( reservation.paid ) ).toFixed(2);
            // console.log( 'RESERVATION AFTER UPDATE', reservation );
        }
    });
}

Bolt.Game.prototype.addTransaction = function( args ){
    var publicId = args.reservationPublicId;
    _.each( this.reservations, function( reservation ){
        if( reservation.publicId == publicId ){
            // console.log( reservation );
            if( !reservation.transactions ){
                reservation.transactions = [];
            }

            // Add transaction details
            reservation.transactions.push(args);

            // Update amount paid
            if( !reservation.paid ){
                reservation.paid = 0;
            }
            reservation.paid = ( parseFloat( reservation.paid ) + parseFloat( args.amount ) ).toFixed(2);

            // Update amount due
            if( !reservation.due && reservation.due !== 0 ){
                reservation.due = reservation.total;
            }
            reservation.due = ( parseFloat( reservation.due ) - parseFloat( args.amount ) ).toFixed(2);

        }
    });

    // console.log( 'In addTransaction', args, this );


}
