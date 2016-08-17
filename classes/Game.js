EscapeRoom.Game = function( args ){

    // ID was provided
    if( typeof( args ) == 'string' ){

        // Grab data from DB
        var data = EscapeRoom.Collections.Games.findOne( args );

        // Data was provided
    }else if( typeof( args ) == 'object' ){
        var data;
        // Set properties of object with db data or straight up data
        var game = EscapeRoom.Collections.Games.findOne({date:args.date,time:args.time});
        //console.log('Getting game from object',args,game);
        if( game ){
            data = game;
        }else{
            data = args;
        }

        // Nothing provided; throw error
    }else{
        throw new Meteor.Error( 'KER ERROR', 'Cannot create GAME object without data or id.' );
    }

    // Set properties of object
    for (var prop in data) {
        this[prop] = data[prop];
    }

    var reservations = EscapeRoom.Collections.Reservations.find({time:this.time,date:this.date}).fetch();
    this.reservations = reservations;

    if( !this.players ){
        this.players = [];
        var nbPlayers = 0;
        if( this.reservations && this.reservations.length > 0 ){
            _.each(reservations,function(reservation){
                nbPlayers = nbPlayers + parseInt(reservation.nbPlayers);
            });
            for( var x = 0; x < nbPlayers; x++ ){
                this.players.push( "" );
            }
        }
    }

    var isBlocked = false;
    if( this.reservations && this.reservations.length > 0 ){
        _.each(reservations,function(reservation){
            if( reservation.blocked == true ){
                isBlocked = true;
            }
        });
    }
    this.isBlocked = isBlocked;
    
    // //console.log('end of game constructor', this);

}

EscapeRoom.Game.prototype.save = function(){

    var result;

    //console.log( 'IN GAME SAVE', this, this._id );

    // Got ID; means game is already in DB; update document in DB
    if( this._id ){
        result = this.update();

        // No ID; means trip is not in DB; insert document into DB
    }else{
        result = this.create();
    }

    return result;

}

EscapeRoom.Game.prototype.update = function(){
    //console.log( 'IN GAME UPDATE', this );

    var result = EscapeRoom.Collections.Games.update(
        {
            _id: this._id
        },
        {
            $set: _.omit( this, '_id' )
        }
    );

    return result;

}

EscapeRoom.Game.prototype.create = function() {

    //console.log( 'IN GAME CREATE', this );

    var result = EscapeRoom.Collections.Games.insert(this);

    if( result ){
        this._id = result;
        return this._id;
    }else{
        return false;
    }

}

EscapeRoom.Game.prototype.addPlayer = function( email ){
    this.players.push( email );
}
EscapeRoom.Game.prototype.addPlayers = function( emails ){
    var game = this;
    _.each( emails, function( email ){
        game.addPlayer(email);
    });
}
EscapeRoom.Game.prototype.sendFollowUpEmail = function(){
    if( Meteor.isClient ) {
        var game = this;
        var to;
        if (game._id && game.players && game.players.length > 0) {
            to = game.players.join();
            Meteor.call(
                'sendEmail',
                to,
                '"Kauai Escape Room" info@escaperoomkauai.com',
                'How did you like your Kauai Escape Room experience?',
                EscapeRoom.getFollowUpEmailBody(),
                function (err, res) {
                    if (err) {
                        Notifications.error('Error', err.message);
                    } else {
                        EscapeRoom.Collections.Games.update(
                            game._id,
                            {
                                $set: {
                                    followUpEmailSent: true
                                }
                            }
                        );
                        Notifications.success('Email sent', 'Email sent to ' + to);
                    }
                }
            );
        }else{
            Notifications.error('Error','No game ID or no players.');
        }
    }
}