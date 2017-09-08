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
Template.adminCouponsCreate.onCreated(function(){});

/**
 * =============================================================
 * TEMPLATE RENDERED
 * =============================================================
 */
Template.adminCouponsCreate.onRendered(function(){});


/**
 * =============================================================
 * TEMPLATE DESTROYED
 * =============================================================
 */
Template.adminCouponsCreate.onDestroyed(function(){});

/**
 * =============================================================
 * TEMPLATE EVENTS
 * =============================================================
 */
Template.adminCouponsCreate.events({
    /**
     * Form submission
     * @param evt
     * @param tmpl
     */
    'submit [hook="create-coupon"]': function(evt,tmpl){

        // Prevent default event behavior
        evt.preventDefault();

        // Get form date
        var formData = Bureaucrat.getFormData($(evt.target));

        // Set number of uses to 0
        formData.uses = 0;

        // Generate coupon code
        // Force uppercase on coupon - the checkout process also forces
        // uppercase on user input
        formData.coupon = 'K' + Random.hexString(5).toUpperCase();
        formData.coupon = formData.coupon.replace('0', 'B');
        formData.coupon = formData.coupon.replace('O', 'A');
        formData.coupon = formData.coupon.replace('1', 'L');
        formData.coupon = formData.coupon.replace('I', 'X');

        // Validate coupon form
        var isCouponAmountValid = false;
        if( !formData.discount ){
            formData.discount = 0;
        }else{
            formData.discount = parseInt( formData.discount );
        }
        if( !formData.commission ){
            formData.commission = 0;
        }else{
            formData.commission = parseInt( formData.commission );
        }
        if( formData.couponType == 'PERCENTAGE' || formData.couponType == 'DOLLAR' ){
            if( formData.discount && parseInt( formData.discount ) > 0 ){
                isCouponAmountValid = true;
            }
        }
        if( formData.couponType == 'COMMISSION'){
            if( formData.commission > 0 ){
                isCouponAmountValid = true;
            }
        }

        formData.createdAt = new Date();


        console.log( 'FORM DATA', formData );

        // Insert coupon
        var result = Bolt.Collections.Coupons.insert(formData);

        // Notify user
        if ( result ){
            Notifications.success('Coupon Created', 'Coupon ' + formData.coupon + ' created!')
            Router.go('adminCouponsList');
        }else{
            Notifications.error( 'Error', 'Could not create coupon.' );
        }
    }
});


/**
 * =============================================================
 * TEMPLATE HELPERS
 * =============================================================
 */
Template.adminCouponsCreate.helpers({});
