

/**
 * Directions
 */
Router.route('/directions', {
    name: 'directions',
    sitemap: true,
    changefreq: 'monthly',
    priority: '0.1',
    ironMeta: true,
    data: function(){
        return Bolt.Collections.Settings.findOne({settingType: 'global'});
    },
    meta: function() {
        var title = 'Directions - Kauai Escape Room - Escape Games, Puzzle Rooms';
        var description = 'We are located at 4353 Rice Street, Unit #1. Reserve online before showing up.';
        var image = 'https://www.escaperoomkauai.com/images/social-banner-logo.png';
        return {
            title: title,
            description: description,
            keywords: 'kauai, escape room, escape game, puzzle room',
            canonical: 'https://www.escaperoomkauai.com/directions',
            "og:title": title,
            "og:type": 'website',
            "og:url": 'https://www.escaperoomkauai.com/directions',
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