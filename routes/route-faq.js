/**
 * FAQ
 */
Router.route('/faq', {
    name: 'faq',
    sitemap: true,
    changefreq: 'monthly',
    priority: '0.5',
    ironMeta: true,
    data: function(){
        return Bolt.Collections.Settings.findOne({settingType: 'global'});
    },
    meta: function() {
        var title = 'FAQ - Frequently Asked Questions - Kauai Escape Room';
        var description = 'First time players always have a lot of questions. We understand. Here are the most common ones. Feel free to call us for more info.';
        var image = 'https://www.escaperoomkauai.com/images/social-banner-logo.png';
        return {
            title: title,
            description: description,
            keywords: 'kauai, escape room, escape game, puzzle room',
            canonical: 'https://www.escaperoomkauai.com/faq',
            "og:title": title,
            "og:type": 'website',
            "og:url": 'https://www.escaperoomkauai.com/faq',
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