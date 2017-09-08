/**
 * Room details
 */
Router.route('/room/:slug', {
    name: 'room',
    waitOn: function(){
        return [
            Meteor.subscribe( 'room', this.params.slug )
        ]
    },
    sitemap: true,
    changefreq: 'monthly',
    priority: '0.9',
    ironMeta: true,
    meta: function(){
        var room =  Bolt.Collections.Rooms.findOne({slug:this.params.slug});
        var title, image, description, slug;
        if( room ){
            title = room.title + ' - Kauai Escape Room';
            image = 'https://www.escaperoomkauai.com' + room.image;
            description = room.description;
        }else{
            title = 'Kauai Escape Room';
            image = 'https://www.escaperoomkauai.com/images/social-banner-logo.png';
            description = 'An escape game by Kauai Escape Room';
        }
        return {
            title: title,
            description: description,
            keywords: 'kauai, escape room, escape game, puzzle room',
            canonical: 'https://www.escaperoomkauai.com/room/'+this.params.slug,
            "og:title": title,
            "og:type": 'website',
            "og:url": 'https://www.escaperoomkauai.com/room/'+this.params.slug,
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
    },
    data: function(){
        var room =  Bolt.Collections.Rooms.findOne({slug:this.params.slug});
        var settings = Bolt.Collections.Settings.findOne({settingType: 'global'});
        return {
            room: room,
            settings: settings
        };
    }
});