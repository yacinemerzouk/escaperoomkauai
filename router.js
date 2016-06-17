/**
 * Router options
 */
Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound'
});

/**
 * Home
 */
Router.route('/', {
    name: 'home',

});

/**
 * ROOMS
 */
Router.route('/rooms', {
    name: 'rooms',

});

/**
 * FAQ
 */
Router.route('/faq', {
    name: 'faq',

});

/**
 * ABOUT
 */
Router.route('/about', {
    name: 'about',

});

/**
 * Contact
 */
Router.route('/contact', {
    name: 'contact',

});


/**
 * Room details
 */
Router.route('/room/mad-scientist', {
    name: 'roomMadScientist'
});
Router.route('/room/art-heist', {
    name: 'roomArtHeist'
});
Router.route('/room/tiki-lounge', {
    name: 'roomTikiLounge'
});
Router.route('/room/mobile', {
    name: 'roomMobile'
});


/**
 * Body class hook
 */
Router.onBeforeAction('bodyClass');