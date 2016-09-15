if (Bolt.Collections.Settings.find().count() === 0) {
    Bolt.Collections.Settings.insert({
        settingType: "global",
        aboutCover: "",
        aboutDescription: "We're a couple from Kapaa. He is a published game designer and storytelling enthusiast. She is an educator with a creative mind. We've been making our own escape room games since 2015 and we're now opening Kauai Escape Room.",
        address: "456 Kuhio Hwy. Kapaa HI 96746",
        calendarCover: "",
        calendarIntro: "Each one of our escape rooms is themed and set-designed to offer a unique immersive experience.",
        companyName: "New Company Name",
        email: "contact@yourcompany.com",
        firstCite: "Caroline F, Tripadvisor",
        firstTestimonial: "Awesome adventure! If you're on Kaua'i you have to check out this adventure. It was great family fun.",
        gMapDirections: "https://goo.gl/maps/it4knh86DxB2",
        homepageCoverImage: "",
        homepageHeroTagline: "Find clues and solve puzzles to unravel the mysteries of the room!",
        homepageHeroTitle: "Can you escape?",
        homepageWhatEscape: "Escape rooms are live action games. Enter a room with your group, find clues and solve puzzles to unravel the mysteries of the room and escape within a set time limit. It's a fun and exciting rush of adrenaline. Are you up for the challenge?",
        phone: "(808) 123-4567",
        roomsCover: "",
        roomsIntro: "Each one of our escape rooms is themed and set-designed to offer a unique and immersive experience.",
        secondCite: "Rolo B, Facebook",
        secondTestimonial: "Escape rooms are recognized worldwide as one of the best & most fun group activities you can engage in. Kauai's Escape Room is no exception. The quality of puzzles & set design are superb."
    });
}