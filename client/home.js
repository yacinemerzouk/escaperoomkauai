Template.home.events({
    'click [hook="explainer"]': function(evt,tmpl){
        evt.preventDefault();
        $('html, body').animate({
            scrollTop: $('#explainer').offset().top
        }, 500);
    },
    'click [hook="rooms"]': function(evt,tmpl){
        evt.preventDefault();
        $('html, body').animate({
            scrollTop: $('#rooms').offset().top
        }, 600);
    }
});

Template.home.created = function(){
    var title = "Escape Room Kauai - Escape Games, Puzzle Rooms";
    DocHead.setTitle(title);

    var metaInfo = {name: "description", content: "Escape Room Kauai offers live action escape games and puzzle rooms. We're located in Kapaa, Hawaii."};
    DocHead.addMeta(metaInfo);
}