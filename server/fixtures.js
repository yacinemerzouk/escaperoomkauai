var startDate = Epoch.dateObjectToDateString( new Date() );
for( var x = 0; x < 30; x++ ){
    var date = Epoch.addDaysToDate(x,startDate);
    if( Bolt.Collections.Games.find({date:date}).count() === 0 ){

        var game = new Bolt.Game({
            userId: "LgZ6PWa83zq4k5PTt",
            roomId: "any",
            date: date,
            time: "10:30am"
        });
        game.save();

        var game = new Bolt.Game({
            userId: "LgZ6PWa83zq4k5PTt",
            roomId: "any",
            date: date,
            time: "12:30pm"
        });
        game.save();

        var game = new Bolt.Game({
            userId: "LgZ6PWa83zq4k5PTt",
            roomId: "any",
            date: date,
            time: "2:30pm"
        });
        game.save();

        var game = new Bolt.Game({
            userId: "LgZ6PWa83zq4k5PTt",
            roomId: "any",
            date: date,
            time: "4:30pm"
        });
        game.save();

        var game = new Bolt.Game({
            userId: "LgZ6PWa83zq4k5PTt",
            roomId: "any",
            date: date,
            time: "6:30pm"
        });
        game.save();

        var game = new Bolt.Game({
            userId: "LgZ6PWa83zq4k5PTt",
            roomId: "any",
            date: date,
            time: "8:30pm"
        });
        game.save();
    }
}



// if (Bolt.Collections.Settings.find().count() === 0) {
//     Bolt.Collections.Settings.insert({
//         settingType: "global",
//         aboutCover: "/images/hero-generic.jpg",
//         aboutDescription: "We're a couple from Kapaa. He is a published game designer and storytelling enthusiast. She is an educator with a creative mind. We've been making our own escape room games since 2015 and we're now opening Kauai Escape Room.",
//         address: "456 Kuhio Hwy. Kapaa HI 96746",
//         calendarCover: "/images/hero-generic.jpg",
//         calendarIntro: "Each one of our escape rooms is themed and set-designed to offer a unique immersive experience.",
//         companyName: "New Company Name",
//         contactCover: "/images/hero-generic.jpg",
//         directionsCover: "/images/hero-generic.jpg",
//         email: "contact@yourcompany.com",
//         faqCover: "/images/hero-generic.jpg",
//         faqIntro: "Learn more about our escape room games.",
//         firstCite: "Caroline F, Tripadvisor",
//         firstTestimonial: "Awesome adventure! If you're on Kaua'i you have to check out this adventure. It was great family fun.",
//         gMapDirections: "https://goo.gl/maps/it4knh86DxB2",
//         homepageCover: "/images/hero-generic.jpg",
//         homepageCoverImage: "/images/hero-generic.jpg",
//         homepageHeroTagline: "Find clues and solve puzzles to unravel the mysteries of the room!",
//         homepageHeroTitle: "You will escape...",
//         homepageWhatEscape: "Escape rooms are live action games. Enter a room with your group, find clues and solve puzzles to unravel the mysteries of the room and escape within a set time limit. It's a fun and exciting rush of adrenaline. Are you up for the challenge?",
//         logoURL: '/images/logo.png',
//         phone: "(808) 123-4567",
//         roomsCover: "/images/hero-generic.jpg",
//         roomsIntro: "Each one of our escape rooms is themed and set-designed to offer a unique and immersive experience.",
//         secondCite: "Rolo B, Facebook",
//         secondTestimonial: "Escape rooms are recognized worldwide as one of the best & most fun group activities you can engage in. Kauai's Escape Room is no exception. The quality of puzzles & set design are superb."
//
//     });
// }