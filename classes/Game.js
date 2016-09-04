/**
 * Game class
 * @param args : MongoDB ID or object
 * @constructor
 */
Bolt.Game = function( args ){

    var data;

    // ID was provided
    if( typeof( args ) == 'string' ){

        // Grab data from DB
        data = Bolt.Collections.Games.findOne( args );

    // Data was provided
    }else if( typeof( args ) == 'object' ){


        // Set properties of object with db data or straight up data
        var game = Bolt.Collections.Games.findOne({roomId: args.roomId, date:args.date,time:args.time});
        if( game ){
            data = game;
        }else{
            data = args;
        }

        // Nothing provided; throw error
    }else{
        throw new Meteor.Error( '[Bolt][Game][constructor] Error', 'Cannot create GAME object without data or id.' );
    }

    // Set properties of object
    for (var prop in data) {
        this[prop] = data[prop];
    }

    // Grab reservations for this game
    var reservations = Bolt.Collections.Reservations.find(
        {
            $or: [
                {
                    roomId: this.roomId
                },
                {
                    blocked: true
                }
            ],
            time:this.time,
            date:this.date,
            canceled:{
                $ne:true
            }
        }
    ).fetch();
    this.reservations = reservations;

    // Check whether this game slot has been blocked by admins
    // If a reservation has prop blocked => true, then it's blocked
    var isBlocked = false;
    if( this.reservations && this.reservations.length > 0 ){
        _.each(reservations,function(reservation){
            if( reservation.blocked == true ){
                isBlocked = true;
            }
        });
    }
    this.isBlocked = isBlocked;

}

/**
 * Save game
 * @returns {*} : _id of document or false
 */
Bolt.Game.prototype.save = function(){

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
 * Update game
 * @returns {any} : _id of document or false
 *
 * Never use this function directly; use save() instead.
 */
Bolt.Game.prototype.update = function(){

    var result = Bolt.Collections.Games.update(
        {
            _id: this._id
        },
        {
            $set: _.omit( this, '_id' )
        }
    );

    if( result == 0 ){
        throw new Meteor.Error( '[Bolt][Game][update] Error', 'No document updated.' );
    }

    return result > 0 ? this._id : false;

}

/**
 * Create game
 * @returns {*} : _id of document or false
 *
 * Never use this function directly; use save() instead.
 */
Bolt.Game.prototype.create = function() {

    // Insert in DB
    var result = Bolt.Collections.Games.insert(this);

    // If insert was successful, we get an ID back
    // Assign ID to object to we don't have to re-generate it
    if( result ){
        this._id = result;
        return this._id;
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
    if( !this.players ){
        this.players = [];
    }
    this.players.push( player );
}

/**
 * Add multiple players
 * @param players
 */
Bolt.Game.prototype.addPlayers = function( players ){
    var game = this;
    _.each( players, function( player ){
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
                emailArray.join(),
                '"Kauai Escape Room" info@escaperoomkauai.com',
                'How did you like your Kauai Escape Room experience?',
                Bolt.getFollowUpEmailBody(),
                function (err, res) {

                    // If error, log and notify user
                    if (err) {
                        Notifications.error('Error', 'Could not send email. Please contact webmaster.');
                        throw new Meteor.Error( '[Bolt][Game][sendFollowUpEmail] Error', 'Error message: ' + err.message );

                    // If response OK, update game in DB and notify user
                    } else {
                        game.followUpEmailSent = true;
                        game.save();
                        Notifications.success('Email sent', 'Email sent to ' + to);
                    }
                }
            );
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
    var nbPlayers = 0;
    if( this.reservations && this.reservations.length > 0 ){
        _.each(this.reservations,function(reservation){
            nbPlayers = nbPlayers + parseInt(reservation.nbPlayers);
        });
    }
    return nbPlayers;
}
