UI.registerHelper('activeFlag', function( routeName ) {
    return Router.current().route.getName() === routeName ? 'active' : '';
});