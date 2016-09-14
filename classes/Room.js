/**
 * Room class
 * @param args : MongoDB ID or object
 * @constructor
 * TODO: clean up when we grab data from DB and when we create object from data
 */
Bolt.Room = function( args ){

    var data;

    // ID was provided
    if( typeof( args ) == 'string' ){

        // Grab data from DB
        data = Bolt.Collections.Rooms.findOne( args );

        // Data was provided
    }else if( typeof( args ) == 'object' ){


        // Set properties of object with db data or straight up data
        var room = Bolt.Collections.Rooms.findOne({_id: this.id});
        if( room ){
            data = room;
        }else{
            data = args;
        }

        // Nothing provided; throw error
    }else{
        throw new Meteor.Error( '|Bolt|Room|constructor', 'Cannot create ROOM object without data or id.' );
    }

    // Set properties of object
    this.populate(data);

}

/**
 * Populate - Update multiple attributes at once; only overwrites attributes passed, not entire object data.
 * @param data
 */
Bolt.Room.prototype.populate = function( data ){

    // Set properties of object
    for (var prop in data) {
        this[prop] = data[prop];
    }

}

/**
 * Save Room
 * @returns {*} : _id of document or false
 */
Bolt.Room.prototype.save = function(){

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
 * Update Room
 * @returns {any} : _id of document or false
 *
 * Never use this function directly; use save() instead.
 */
Bolt.Room.prototype.update = function(){

    // Update DB
    var result = Bolt.Collections.Rooms.update(
        {
            _id: this._id
        },
        {
            $set: _.omit( this, '_id' )
        }
    );

    // If number of rows update is 0, throw error
    if( result == 0 ){
        throw new Meteor.Error( '[Bolt][Room][update] Error', 'No document updated.' );
    }

    // Return ID or false
    return result > 0 ? this._id : false;

}

/**
 * Create Room
 * @returns {*} : _id of document or false
 *
 * Never use this function directly; use save() instead.
 */
Bolt.Room.prototype.create = function() {

    // Insert in DB
    var result = Bolt.Collections.Rooms.insert(this);

    // If insert was successful, we get an ID back
    // Assign ID to object to we don't have to re-generate it
    if( result ){
        this._id = result;
        return this._id;

        // Throw error if insert failed
    }else{
        throw new Meteor.Error( '[Bolt][Room][create] Error', 'Could not insert document.' );
        return false;
    }

}


/**
 * Trash Room
 * @returns {any} : _id of document or false
 *
 * Sets published key to value of false
 */
Bolt.Room.prototype.trash = function(){

    // Update DB
    var result = Bolt.Collections.Rooms.update(
        {
            _id: this._id
        },
        {
            $set: {published: false}
        }
    );

    // If number of rows update is 0, throw error
    if( result == 0 ){
        throw new Meteor.Error( '[Bolt][Room][update] Error', 'No document updated.' );
    }

    // Return ID or false
    return result > 0 ? this._id : false;

}


