
Template.adminScheduleDay.helpers({
    'games': function(){
        var games = Bolt.Collections.Games.find({date:this.date}).fetch();
        return games;
    }
});

// Template.adminScheduleDay.events({
//     'click [hook="add-game"]': function( evt, tmpl ){
//         evt.preventDefault();
//         var date = $(evt.currentTarget).attr('hook-data');
//         console.log( 'Adding game', date );
//         Blaze.renderWithData(Template.calendarFormAddGame,{date:date},$('body')[0]);
//     },
//     'click [hook="edit-game"]':function(evt,tmpl){
//         evt.preventDefault();
//         var gameId = $(evt.currentTarget).attr('hook-data');
//         Blaze.renderWithData(Template.calendarFormEditGame,{gameId:gameId},$('body')[0]);
//     }
// });