/**
 * =============================================================
 * DATA CONTEXT
 * Template data: none
 * Router subscriptions: none
 * Template subscriptions: roomList
 * =============================================================
 */
 
/**
 * =============================================================
 * TEMPLATE CREATED
 * =============================================================
 */
Template.footer.onCreated(function(){});

/**
 * =============================================================
 * TEMPLATE RENDERED
 * =============================================================
 */
Template.footer.onRendered(function(){
    Meteor.subscribe('roomList');
});


/**
 * =============================================================
 * TEMPLATE DESTROYED
 * =============================================================
 */
Template.footer.onDestroyed(function(){});

/**
 * =============================================================
 * TEMPLATE EVENTS
 * =============================================================
 */
Template.footer.events({});


/**
 * =============================================================
 * TEMPLATE HELPERS
 * =============================================================
 */
Template.footer.helpers({
    rooms: function(){
        var rooms = Bolt.Collections.Rooms.find(
            {
                published: true
            },
            {
                fields: {
                    title: 1,
                    slug: 1
                }
            }
        );
        return rooms;
    }
});