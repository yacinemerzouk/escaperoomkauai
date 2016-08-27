Template.coupons.helpers({
    coupons: function(){
        return Bolt.Collections.Coupons.find();
    }
});

Template.coupons.events({
    'submit [hook="create-coupon"]': function(evt,tmpl){
        evt.preventDefault();
        var formData = Bureaucrat.getFormData($(evt.target));
        formData.uses = 0;
        var result = Bolt.Collections.Coupons.insert(formData);
        if ( result ){
            Notifications.success('Coupon Created', 'Coupon ' + formData.coupon + ' created!')
        }
    }
});