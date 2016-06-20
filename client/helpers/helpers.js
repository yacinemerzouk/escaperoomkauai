UI.registerHelper('activeFlag', function( routeName ) {
    return Router.current().route.getName() === routeName ? 'active' : '';
});

UI.registerHelper('canBook', function( roomId, date, time ) {

    var spotsLeft = EscapeRoom.spotsLeft(roomId, date, time);
    //var room = EscapeRoom.Collections.Rooms.findOne(roomId);
    //
    //var spotsLeft = room.maxPlayers;
    //
    //var reservations = EscapeRoom.Collections.Reservations.find({
    //    roomId: roomId,
    //    time: time,
    //    date: date
    //}).fetch();
    //
    //if( reservations && reservations.length > 0 ){
    //    console.log('found res');
    //    _.each( reservations, function( reservation ){
    //        console.log('looping over', reservation);
    //        spotsLeft = spotsLeft - reservation.nbPlayers;
    //    });
    //}
    return spotsLeft >= 2;
});

UI.registerHelper('hasEnoughSpots', function( roomId, date, time ) {

    var spotsLeft = EscapeRoom.spotsLeft(roomId, date, time);
    //var room = EscapeRoom.Collections.Rooms.findOne(roomId);
    //
    //var spotsLeft = room.maxPlayers;
    //
    //var reservations = EscapeRoom.Collections.Reservations.find({
    //    roomId: roomId,
    //    time: time,
    //    date: date
    //}).fetch();
    //
    //if( reservations && reservations.length > 0 ){
    //    console.log('found res');
    //    _.each( reservations, function( reservation ){
    //        console.log('looping over', reservation);
    //        spotsLeft = spotsLeft - reservation.nbPlayers;
    //    });
    //}
    return parseInt(spotsLeft) >= parseInt(Session.get('selectedNbPlayers'));
});

UI.registerHelper('spotsLeft', function( roomId, date, time ) {

    return EscapeRoom.spotsLeft(roomId, date, time);

    //var room = EscapeRoom.Collections.Rooms.findOne(roomId);
    //
    //var spotsLeft = room.maxPlayers;
    //
    //var reservations = EscapeRoom.Collections.Reservations.find({
    //    roomId: roomId,
    //    time: time,
    //    date: date
    //}).fetch();
    //
    //if( reservations && reservations.length > 0 ){
    //    console.log('found res');
    //    _.each( reservations, function( reservation ){
    //        console.log('looping over', reservation);
    //        spotsLeft = spotsLeft - reservation.nbPlayers;
    //    });
    //}
    //return spotsLeft;
});

UI.registerHelper('toCurrency', function( n ) {
    return '$' + parseFloat(n).toFixed(2);
});

UI.registerHelper('selected', function( value, selected ){
    return value.toString() === selected.toString() ? 'selected' : '';
});

UI.registerHelper('checked', function( checked ){
    return checked ? 'checked' : '';
});


UI.registerHelper('roomTitle', function( roomId ){
    var room = EscapeRoom.Collections.Rooms.findOne({
        _id: roomId
    });
    return room.title;
});

UI.registerHelper('isNumber', function( number ){
    return !isNaN(number);
});