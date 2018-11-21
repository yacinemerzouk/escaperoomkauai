/**
 * =============================================================
 * DATA CONTEXT
 * Template data: settings
 * Router subscriptions: roomList, roomOverview (popular)
 * Template subscriptions: successRates
 * =============================================================
 */

/**
 * =============================================================
 * TEMPLATE CREATED
 * =============================================================
 */
Template.home.onCreated(function(){});

/**
 * =============================================================
 * TEMPLATE RENDERED
 * =============================================================
 */
Template.home.onRendered(function(){
    // Bolt.getSuccessRates();
});


/**
 * =============================================================
 * TEMPLATE DESTROYED
 * =============================================================
 */
Template.home.onDestroyed(function(){});

/**
 * =============================================================
 * TEMPLATE EVENTS
 * =============================================================
 */
Template.home.events({
    'click [hook="explainer"]': function(evt,tmpl){
        evt.preventDefault();
        $('html, body').animate({
            scrollTop: $('#explainer').offset().top
        }, 500);
    },
    'click [hook="rooms"]': function(evt,tmpl){
        evt.preventDefault();
        $('html, body').animate({
            scrollTop: $('#rooms').offset().top
        }, 600);
    }
});


/**
 * =============================================================
 * TEMPLATE HELPERS
 * =============================================================
 */
Template.home.helpers({
    rooms: function(){
        var rooms = Bolt.Collections.Rooms.find( { published: true }, { sort: { order:1 } } );
        return rooms;
    },
    mostPopular: function(){
        return Bolt.Collections.Rooms.findOne( { slug: 'tiki-lounge' } );
    },
    newest: function(){
        return Bolt.Collections.Rooms.findOne( { slug: 'lost-continent' } );
    },
    successRates: function(){
        Session.get('successRates');
    }
});
