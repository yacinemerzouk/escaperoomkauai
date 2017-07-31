// UI HELPERS FOR SPACEBARS TEMPLATES

/**
 * HELPER: activeFlag
 *
 * Outputs either "active" or "", depending on whether current route name matche routeName arg
 *
 * @param routeName : String : the route name to check
 * @returns String: "active" or ""
 */
UI.registerHelper('activeFlag', function( routeName ) {
    return Router.current().route.getName() === routeName ? 'active' : '';
});

/**
 * HELPER: canBook
 *
 * Checks whether a time slot is available to be booked -- does not check nb of players requested, so
 * any time slot with 2 or more available spots should return true
 *
 * TODO: allow single-player re5servations
 *
 * @param roomId : String : a room _id
 * @param date: String : a MySQL-formatted date
 * @param time: String : a HH:MM:am or HH:MM:pm formatted time
 * @returns Boolean : whether or not the room can be booked for the time slot
 */
UI.registerHelper('canBook', function( roomId, date, time ) {

    var spotsLeft = Bolt.spotsLeft(roomId, date, time);
    // console.log( 'CAN BOOK', roomId, date, time, spotsLeft );

    return spotsLeft >= 2;

});

/**
 * HELPER: hasEnoughSpots
 *
 * Checks whether a time slot has enough spots remaining to accomodate
 * new reservation nbPlayers
 *
 * @param roomId : String : a room _id
 * @param date: String : a MySQL-formatted date
 * @param time: String : a HH:MM:am or HH:MM:pm formatted time
 * @returns Boolean : whether or not the room has enough spots remaining for the time slot
 */
UI.registerHelper('hasEnoughSpots', function( roomId, date, time, nbPlayers ) {

    //console.log( 'in hasEnoughSpots', roomId, date, time, nbPlayers);

    var spotsLeft = Bolt.spotsLeft(roomId, date, time);

    return nbPlayers && parseInt(nbPlayers) > 0 &&  parseInt(spotsLeft) >= parseInt(nbPlayers);

});

/**
 * HELPER: spotsLeft
 *
 * Returns how many spots are left for time slot
 *
 * @param roomId : String : a room _id
 * @param date: String : a MySQL-formatted date
 * @param time: String : a HH:MM:am or HH:MM:pm formatted time
 * @returns Int : how many spots are left for time slot
 */
UI.registerHelper('spotsLeft', function( roomId, date, time ) {

    return Bolt.spotsLeft(roomId, date, time);

});

/**
 * HELPER: toCurrency
 *
 * Converts a number to a string in currency format
 *
 * @param n : Number : the number to format
 * @return String: currency-formatted number
 */
UI.registerHelper('toCurrency', function( n ) {
    return '$' + parseFloat(n).toFixed(2);
});

/**
 * HELPER selected
 *
 * Auto-select option in select tag
 *
 * @param value : String : value to compare
 * @param selected : String : value to compare
 * @returns String : "selected" or ""
 */
UI.registerHelper('selected', function( value, selected ){
    if( value && selected ) {
        return value.toString() === selected.toString() ? 'selected' : '';
    }else{
        return '';
    }
});

/**
 * HELPER checked
 *
 * Auto-check radio button or checkbox
 *
 * @param checked : String : value to compare
 * @returns String : "checked" or ""
 */
UI.registerHelper('checked', function( checked ){
    return checked ? 'checked' : '';
});

/**
 * HELPER: roomTitle
 *
 * Get the title of a room -- useful when you only have room _id in spacebars context
 *
 * @param roomId : String : the room DB _id
 * @returns String : the room title
 */
UI.registerHelper('roomTitle', function( roomId ){
    if(roomId == 'any'){
        return 'Any Game For GM';
    }else {
        var room = Bolt.Collections.Rooms.findOne({
            _id: roomId
        });
        return room && room.title ? room.title : "";
    }
});

/**
 * HELPER: isNumber
 *
 * Checks if value is a number
 *
 * @param: Mixed : value to check
 * @returns : Boolean
 */
UI.registerHelper('isNumber', function( number ){
    return !isNaN(number);
});

UI.registerHelper('unixToHumanReadableDate', function( number ){
    var jsDate = new Date(number*1000);
    return Epoch.dateObjectToDateString( jsDate );
});

UI.registerHelper('unixToHumanReadableDateTime', function( number ){
    var jsDate = new Date(number*1000);
    return Epoch.dateObjectToDateTimeString( jsDate );
});


UI.registerHelper('dump', function( data ){
    return "DUMP\n==================\n" + JSON.stringify(data,null,'\t');
});

UI.registerHelper('centsToDollarsCurrency', function( n ){
    return '$' + (parseFloat(n)/100).toFixed(2);
});

UI.registerHelper('toUpperCase', function( string ){
    if( string ){
        return string.toUpperCase();
    }else{
        return '';
    }
});

UI.registerHelper('loopCount', function(count){
    var countArr = [];
    for (var i=0; i<count; i++){
        countArr.push({});
    }
    return countArr;
});

UI.registerHelper('kamaainaPerPlayer', function(room){
    return room.pricePerPlayer - room.kamaainaDiscountPerPlayer;
})

UI.registerHelper('gameHasResult', function(game){
    return game.won === true ||  game.won === false;
})

UI.registerHelper('stringifyId', function(id){
    return id && typeOf(id) == "String" ? id : id._str;
})

//Text Area to HTML Helper
UI.registerHelper('textareaToHTML', function( content ) {
    return Spacebars.SafeString( content.replace(/\n/g, '<br><br>') );
});

UI.registerHelper('isCanceled', function(reservation){
    return reservation.status == 'canceled';
})

UI.registerHelper('calculateNbPlayers',function(game){
    var nbPlayers = 0;
    if( game.reservations ) {
        _.each(game.reservations, function (reservation) {
            if( reservation.canceled !== true ) {
                nbPlayers += parseInt(reservation.nbPlayers);
            }
        });
    }
    return nbPlayers;
})

UI.registerHelper('canBeBooked',function( gameData ){
    //console.log( 'GAME DATA', gameData );
    var game = new Bolt.Game( gameData );
    var nbPlayers = game.getNbPlayers();
    return game.canBeBooked( nbPlayers );
});

UI.registerHelper('isZero',function( n ){
    return parseInt(n) == 0 ? true : false;
});

UI.registerHelper('hasReservations',function( game ){
    var nbRes = 0;
    if( game.reservations && game.reservations.length > 0 ) {
        _.each(game.reservations, function (reservation) {
            if (reservation.canceled !== true) {
                nbRes += 1;
            }
        });
    }
    return nbRes > 0 ? true : false;
});

UI.registerHelper('isClosedRoom',function( game ){
    var isClosedRoom = false;
    var game = new Bolt.Game( game );
    _.each( game.reservations, function(reservation){
        if( reservation.closeRoom ){
            isClosedRoom = true;
        }
    });
    return isClosedRoom;
});

UI.registerHelper('isPaidInFull',function( game ){
    var isPaidInFull = true;
    var game = new Bolt.Game( game );
    _.each( game.reservations, function(reservation){
        if( parseInt( reservation.due ) != 0 ){
            isPaidInFull = false;
        }
    });
    return isPaidInFull;
});

UI.registerHelper('gameMasterName',function( userId ){
    var user = Meteor.users.findOne(userId);
    return user.username;
});

UI.registerHelper('canChooseRoom',function( roomId ){
    return roomId == 'any' ? true : false;
});

UI.registerHelper('roomChoices',function( args ){
    // console.log(args.hash.gameId);
    var gameId = args.hash.gameId;
    var game = new Bolt.Game(gameId);
    var user = Meteor.users.findOne(game.userId);
    // console.log('roomchoices', game);
    var rooms = [];
    _.each(user.profile.rooms, function(roomId){
        rooms.push( new Bolt.Room( roomId ) );
    });
    return rooms;
});

UI.registerHelper('gte',function( args ){
    // console.log('GTE', args);
    return args.hash.n1 >= args.hash.n2;
});

UI.registerHelper('eq',function( args ){
    // console.log('eq', args);
    return args.hash.v1 === args.hash.v2;
});

UI.registerHelper('dayOfWeek',function( date ){
    // console.log(Epoch.dateStringToDateObject(date).getDay());
    var d = Epoch.dateStringToDateObject(date).getDay();
    if( d == 0 ){
        return 'SUN';
    }else if( d == 1 ){
        return 'MON';
    }else if( d == 2 ){
        return 'TUE';
    }else if( d == 3 ){
        return 'WED';
    }else if( d == 4 ){
        return 'THU';
    }else if( d == 5 ){
        return 'FRI';
    }else if( d == 6 ){
        return 'SAT';
    }
});