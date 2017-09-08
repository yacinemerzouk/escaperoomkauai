/**
 * GIFT CARD PURCHASE CONFIRMED
 */
Router.route('/gift-cards/purchase-confirmed/:_id',{
    name: 'giftCardPurchaseConfirmed',
    // layoutTemplate: 'layoutConfirmation',
    waitOn: function(){
        Meteor.subscribe( 'couponById', this.params._id )
    },
    data: function(){
        return { params: this.params };
    },
    sitemap: false,
    ironMeta: true,
    meta: function(){
        var title = 'PURCHASE CONFIRMED - Gift Cards - Kauai Escape Room Gift Cards';
        var description = 'GIFT CARD PURCHASE CONFIRMED -  Kauai Escape Room offers live action escape games and puzzle rooms. We are located on Rice Street in Lihue, Kauai, Hawaii.';
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
})