Accounts.config({
    forbidClientAccountCreation : false
});

if( Meteor.isClient ){
    Accounts.ui.config({
        passwordSignupFields: 'USERNAME_ONLY'
    });
}
