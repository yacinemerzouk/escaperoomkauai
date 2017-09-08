/**
 * =============================================================
 * DATA CONTEXT
 * Template data: params
 * Router subscriptions: couponById
 * Template subscriptions: none
 * =============================================================
 */

/**
 * =============================================================
 * TEMPLATE CREATED
 * =============================================================
 */
Template.giftCardPurchaseConfirmed.onCreated(function(){});

/**
 * =============================================================
 * TEMPLATE RENDERED
 * =============================================================
 */
Template.giftCardPurchaseConfirmed.onRendered(function(){});


/**
 * =============================================================
 * TEMPLATE DESTROYED
 * =============================================================
 */
Template.giftCardPurchaseConfirmed.onDestroyed(function(){});

/**
 * =============================================================
 * TEMPLATE EVENTS
 * =============================================================
 */
Template.giftCardPurchaseConfirmed.events({});


/**
 * =============================================================
 * TEMPLATE HELPERS
 * =============================================================
 */
Template.giftCardPurchaseConfirmed.helpers({
    coupon: function(){
        var coupon = Bolt.Collections.Coupons.findOne( this.params._id );
        console.log( 'COUPON', coupon );
        return coupon;
    }
});
