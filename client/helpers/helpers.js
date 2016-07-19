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
 * TODO: allow single-player reservations
 *
 * @param roomId : String : a room _id
 * @param date: String : a MySQL-formatted date
 * @param time: String : a HH:MM:am or HH:MM:pm formatted time
 * @returns Boolean : whether or not the room can be booked for the time slot
 */
UI.registerHelper('canBook', function( roomId, date, time ) {

    var spotsLeft = EscapeRoom.spotsLeft(roomId, date, time);

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
UI.registerHelper('hasEnoughSpots', function( roomId, date, time ) {

    var spotsLeft = EscapeRoom.spotsLeft(roomId, date, time);

    return parseInt(spotsLeft) >= parseInt(Session.get('selectedNbPlayers'));

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

    return EscapeRoom.spotsLeft(roomId, date, time);

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
    if( value ) {
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
    var room = EscapeRoom.Collections.Rooms.findOne({
        _id: roomId
    });
    return room.title ? room.title : "";
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