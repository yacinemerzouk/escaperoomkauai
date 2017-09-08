/**
 * =============================================================
 * DATA CONTEXT
 * Template data: none
 * Router subscriptions: none
 * Template subscriptions: none
 * =============================================================
 */
 
/**
 * =============================================================
 * TEMPLATE CREATED
 * =============================================================
 */
Template.adminCouponsList.onCreated(function(){});

/**
 * =============================================================
 * TEMPLATE RENDERED
 * =============================================================
 */
Template.adminCouponsList.onRendered(function(){});


/**
 * =============================================================
 * TEMPLATE DESTROYED
 * =============================================================
 */
Template.adminCouponsList.onDestroyed(function(){});

/**
 * =============================================================
 * TEMPLATE EVENTS
 * =============================================================
 */
Template.adminCouponsList.events({});


/**
 * =============================================================
 * TEMPLATE HELPERS
 * =============================================================
 */
Template.adminCouponsList.helpers({
    coupons: function(){
        return Bolt.Collections.Coupons.find({},{sort:{createdAt:-1}});
    }
});
