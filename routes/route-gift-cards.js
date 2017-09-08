/**
 * Gift Cards
 */
Router.route('/gift-cards', {
    name: 'giftCards',
    sitemap: true,
    changefreq: 'monthly',
    priority: '0.3',
    ironMeta: true,
    meta: function(){
        var title = 'Gift Cards - Kauai Escape Room Gift Cards';
        var description = 'Purchase a gift card and have it mailed, emailed, or pick it up in person. Kauai Escape Room offers live action escape games and puzzle rooms. We are located on Rice Street in Lihue, Kauai, Hawaii.';
        var image = 'https://www.escaperoomkauai.com/images/social-banner-logo.png';
        return {
            title: title,
            description: description,
            keywords: 'kauai, escape room, escape game, puzzle room',
            canonical: 'https://www.escaperoomkauai.com/gift-cards',
            "og:title": title,
            "og:type": 'website',
            "og:url": 'https://www.escaperoomkauai.com/gift-cards',
            "og:description": description,
            "og:site_name": 'Kauai Escape Room Gift Cards',
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

