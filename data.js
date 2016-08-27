/**
 * Data populated in DB after meteor reset
 */
// if( Meteor.isServer ){
//     Meteor.startup(function(){
//         if( Bolt.Collections.Rooms.find().count() === 0 ) {
//             Bolt.Collections.Rooms.insert({
//                 title: 'The Missing Scientist',
//                 image: '/images/hero-mad-scientist.jpg',
//                 opening: 'July 2016',
//                 startTimes: ['12:00pm','1:30pm', '3:00pm', '4:30pm', '6:00pm', '7:30pm', '9:00pm'],
//                 slug: 'mad-scientist',
//                 duration: 60,
//                 pricePerPlayer: 30,
//                 priceToClose: 20,
//                 minPlayers: 2,
//                 maxPlayers: 6,
//                 successRate: 40,
//                 excerpt: 'Investigate the study of a missing scientist.',
//                 description: 'The foremost ethnobotanist in the world disappeared five years ago. Word is he has now resurfaced in Hawaii and you are sent to investigate. You will have to use logic, observation, deduction, and teamwork to shine light on this strange situation. Are you up to the task?'
//             });
//             Bolt.Collections.Rooms.insert({
//                 title: "The Lost Elvis Record",
//                 image: '/images/hero-elvis.jpg',
//                 opening: 'July 2016',
//                 slug: 'lost-elvis-record',
//                 startTimes: ['12:30pm','2:00pm', '3:30pm', '5:00pm', '6:30pm', '8:00pm', '9:30pm'],
//                 duration: 30,
//                 pricePerPlayer: 20,
//                 priceToClose: 15,
//                 minPlayers: 2,
//                 maxPlayers: 4,
//                 successRate: 60,
//                 excerpt: 'Tutu Leilani has misplaced one of her vintage Elvis records.',
//                 description: 'Tutu Leilani has misplaced one of her vintage Elvis records. Can you find it for her before a buyer withdraws his offer? You will have to use logic, observation, deduction, creative thinking and teamwork to find this lost Elvis record in time!'
//             });
//             Bolt.Collections.Rooms.insert({
//                 title: "Pele's Tiki Lounge",
//                 image: '/images/hero-tiki-lounge.jpg',
//                 opening: 'August 2016',
//                 slug: 'tiki-lounge',
//                 startTimes: [],
//                 duration: 60,
//                 pricePerPlayer: 30,
//                 priceToClose: 20,
//                 minPlayers: 2,
//                 maxPlayers: 8,
//                 successRate: 20,
//                 excerpt: 'Something strange is happening at this Hawaiian-style tiki lounge.',
//                 description: 'Something strange is happening at this Hawaiian-style tiki lounge. You are sent to investigate and are warned to be on your guard. You will have to use logic, observation, deduction, creative thinking and teamwork to unravel the mystery of the Tiki Lounge.'
//             });
//             Bolt.Collections.Rooms.insert({
//                 title: 'Mobile Escape Room',
//                 image: '/images/hero-mobile.jpg',
//                 opening: 'Fall 2016',
//                 slug: 'mobile',
//                 startTimes: [],
//                 duration: 45,
//                 pricePerPlayer: 'Varies',
//                 priceToClose: 20,
//                 minPlayers: 2,
//                 maxPlayers: 5,
//                 successRate: 50,
//                 excerpt: 'Inquire about our mobile escape room.',
//                 description: 'We can bring Kauai Escape Room games to you! Inquire about our mobile escape room.'
//             });
//         }
//     });
// }

// if( Meteor.isServer ){
//     Meteor.startup(function() {
//         if (Bolt.Collections.Coupons.find().count() === 0) {
//             Bolt.Collections.Coupons.insert(
//                 {
//                     coupon:'GRANDOPENING',
//                     discount: 50,
//                     limitDateFrom: '2016-07-23',
//                     limitDateTo: '2016-07-27'
//                 }
//             );
//         }
//     });
// }

if( Meteor.isServer ){
    Meteor.startup(function() {
        if (Bolt.Collections.Games.find().count() === 0) {
            Bolt.Collections.Games.insert(
                {
                    date:'2016-07-26',
                    time: '9:00pm',
                    won: true,
                    time: '55:00'
                }
            );
            Bolt.Collections.Games.insert(
                {
                    date:'2016-07-26',
                    time: '7:30pm',
                    won: false
                }
            );
        }
    });
}