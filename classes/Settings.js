/**
 * Settings class
 * @param args : MongoDB ID or object
 * @constructor
 */
Bolt.Setting = function( args ){

    var data;

    // ID was provided
    if( typeof( args ) == 'string' ){

        // Grab data from DB
        data = Bolt.Collections.Settings.findOne( args );

        // Data was provided
    }else if( typeof( args ) == 'object' ){


        // Set properties of object with db data or straight up data
        var room = Bolt.Collections.Settings.findOne({_id: this.id});
        if( room ){
            data = room;
        }else{
            data = args;
        }

        // Nothing provided; throw error
    }else{
        throw new Meteor.Error( '|Bolt|Settings|constructor', 'Cannot create SETTINGS object without data or id.' );
    }

    // Set properties of object
    this.populate(data);

}

/**
 * Populate - Update multiple attributes at once; only overwrites attributes passed, not entire object data.
 * @param data
 */
Bolt.Setting.prototype.populate = function( data ){

    // Set properties of object
    for (var prop in data) {
        this[prop] = data[prop];
    }

}


/**
 * Update Settings
 * @returns {any} : _id of document or false
 *
 */
Bolt.Setting.prototype.update = function(){

    // Update DB
    var result = Bolt.Collections.Settings.update(
        {
            _id: this._id
        },
        {
            $set: _.omit( this, '_id' )
        }
    );

    // If number of rows update is 0, throw error
    if( result == 0 ){
        throw new Meteor.Error( '[Bolt][Settings][update] Error', 'No document updated.' );
    }

    // Return ID or false
    return result > 0 ? this._id : false;

}