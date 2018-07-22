/**
 * ROOMS CALENDAR
 */
Router.route('/rooms/calendar', {
    name: 'roomsCalendar',
    sitemap: true,
    changefreq: 'monthly',
    priority: '0.9',
    waitOn: function(){
        var date = Session.get('calendarDay') || Epoch.dateObjectToDateString(new Date());
        return Meteor.subscribe('rooms');
    },
    data: function(){
        return Bolt.Collections.Settings.findOne({settingType: 'global'});
    },
    ironMeta: true,
    meta: function(){
        var title = 'Availability Calendar - Kauai Escape Room - Escape Games, Puzzle Rooms';
        var description = "The complete availability calendar for our escape rooms: Curse of the Tiki Lounge, Hunt for the Golden Tiki, and Quest for the Lost Continent";
        var image = 'https://www.escaperoomkauai.com/images/social-banner-logo.png';
        return {
            title: title,
            description: description,
            keywords: 'kauai, escape room, escape game, puzzle room',
            canonical: 'https://www.escaperoomkauai.com/rooms/calendar',
            "og:title": title,
            "og:type": 'website',
            "og:url": 'https://www.escaperoomkauai.com/rooms/calendar',
            "og:description": description,
            "og:site_name": 'Kauai Escape Room',
            "og:image": image,
            "og:image:width": '1200',
            "og:image:height": '630',
            "twitter:card": 'summary_large_image',
            "twitter:site": '@kauaiescaperoom',
            "twitter:creator": '@kauaiescaperoom',
            "twitter:title": title,
            "twitter:description": description,
            "twitter:image": image
        }
    }
});
