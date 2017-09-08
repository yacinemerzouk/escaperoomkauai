
/**
 * Home
 */
Router.route('/', {
    name: 'home',
    sitemap: true,
    changefreq: 'daily',
    priority: '1.0',
    ironMeta: true,
    waitOn: function(){
        return [
            Meteor.subscribe( 'roomList' ),
            Meteor.subscribe( 'roomOverview', 'popular' )
        ]
    },
    data: function(){
        var globalSettings = Bolt.Collections.Settings.findOne({settingType: 'global'});
        return {
            settings: globalSettings
        };
    },
    meta: function(){
        var title = 'Kauai Escape Room - Escape Games, Puzzle Rooms';
        var description = 'Kauai Escape Room offers live action escape games and puzzle rooms. We are located on Rice Street in Lihue, Kauai, Hawaii.';
        var image = 'https://www.escaperoomkauai.com/images/social-banner-logo.png';
        return {
            title: title,
            description: description,
            keywords: 'kauai, escape room, escape game, puzzle room',
            canonical: 'https://www.escaperoomkauai.com',
            "og:title": title,
            "og:type": 'website',
            "og:url": 'https://www.escaperoomkauai.com',
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