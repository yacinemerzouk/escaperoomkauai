/**
 * GIFT CARD PURCHASE CONFIRMED
 */
Router.route('/gift-cards/purchase-confirmed/:_id',{
    name: 'giftCardPurchaseConfirmed',
    // layoutTemplate: 'layoutConfirmation',
    waitOn: function(){
        Meteor.subscribe( 'couponById', this.params._id )
    },
    data: function(){
        return { params: this.params };
    }
})