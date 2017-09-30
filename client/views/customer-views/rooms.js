/**
 * =============================================================
 * DATA CONTEXT
 * Template data: settings
 * Router subscriptions: roomOverviewList
 * Template subscriptions: none
 * =============================================================
 */

/**
 * =============================================================
 * TEMPLATE CREATED
 * =============================================================
 */
Template.rooms.onCreated(function(){});

/**
 * =============================================================
 * TEMPLATE RENDERED
 * =============================================================
 */
Template.rooms.onRendered(function(){

    $( "#datepicker" ).datepicker();

});


/**
 * =============================================================
 * TEMPLATE DESTROYED
 * =============================================================
 */
Template.rooms.onDestroyed(function(){});

/**
 * =============================================================
 * TEMPLATE EVENTS
 * =============================================================
 */
Template.rooms.events({});


/**
 * =============================================================
 * TEMPLATE HELPERS
 * =============================================================
 */
Template.rooms.helpers({
    rooms: function(){
        var rooms = Bolt.Collections.Rooms.find(
            {
                published: true
            },
            {
                sort: {
                    order: 1
                }
            }
        );
        return rooms;
    },
    mostPopular: function(){
        return Bolt.Collections.Rooms.findOne({slug:'mad-scientist'})
    }
});
