Template.roomForm.helpers({
    updatingRoom: function() {
        return this._id !== undefined;
    }
});

Template.roomForm.events({
    'submit [hook="save-room"]': function(evt){
        evt.preventDefault();

        //Grab form data
        var formObject = $(evt.target);
        var formData = Bureaucrat.getFormData( formObject );

        //console.log( 'SUBMITTING ROOM DATA', formData );

        //Check if room already exists
        if (this._id !== undefined) {

            //Get existing room, populate, and save room
            var room = new Bolt.Room(this._id);
            room.populate(formData);
            room.save();

        } else {

            //Create and save a new room
            var room = new Bolt.Room(formData);
            room.save();
        }


        // Notify and reroute to Rooms list on success
        if ( room ){
            Notifications.success('Room Saved', 'You have successfully saved this room!');
            Router.go('adminRooms');
        } else{
            Notifications.error( "Error", "This room was NOT saved." );
        }
    },
    'click [hook="delete-room"]': function(evt) {
        evt.preventDefault();

        //Get existing room and change published status to false (unpublish)
        var room = new Bolt.Room(this._id);
        room.unpublish();

        //Notify and reroute to Rooms list
        Notifications.error("Room Deleted", "This room has been deleted.");
        Router.go('adminRooms');
    }

});