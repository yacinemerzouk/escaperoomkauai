/**
 * =============================================================
 * DATA CONTEXT
 * Template data: none
 * Router subscriptions: none
 * Template subscriptions: global settings
 *       (Router waitOn doesn't working with not-found template)
 * =============================================================
 */

/**
 * =============================================================
 * TEMPLATE CREATED
 * =============================================================
 */
Template.layoutNotFound.onCreated(function(){});

/**
 * =============================================================
 * TEMPLATE RENDERED
 * =============================================================
 */
Template.layoutNotFound.onRendered(function(){
    Meteor.subscribe('settings','global');
});


/**
 * =============================================================
 * TEMPLATE DESTROYED
 * =============================================================
 */
Template.layoutNotFound.onDestroyed(function(){});

/**
 * =============================================================
 * TEMPLATE EVENTS
 * =============================================================
 */
Template.layoutNotFound.events({});


/**
 * =============================================================
 * TEMPLATE HELPERS
 * =============================================================
 */
Template.layoutNotFound.helpers({});
