/**
 * ABOUT
 */
Router.route('/about', {
    name: 'about',
    sitemap: true,
    changefreq: 'monthly',
    priority: '0.5',
    ironMeta: true,
    data: function(){
        return Bolt.Collections.Settings.findOne({settingType: 'global'});
    },
    meta: function() {
        var title = 'About Us - Kauai Escape Room - Escape Games, Puzzle Rooms';
        var description = 'We are a couple from Kapaa. He is a published game designer and storytelling enthusiast. She is an educator with a creative mind. We have been making our own escape room games since 2015.';
        var image = 'https://www.escaperoomkauai.com/images/social-banner-logo.png';
        return {
            title: title,
            description: description,
            keywords: 'kauai, escape room, escape game, puzzle room',
            canonical: 'https://www.escaperoomkauai.com/about',
            "og:title": title,
            "og:type": 'website',
            "og:url": 'https://www.escaperoomkauai.com/about',
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