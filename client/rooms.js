Template.rooms.rendered = function(){
    $( "#datepicker" ).datepicker();
}

Template.rooms.onCreated(function(){
    var title = "Our Escape Rooms - Escape Room Kauai - Escape Games, Puzzle Rooms";
    DocHead.setTitle(title);

    var metaInfo = {name: "description", content: "Our rooms: Mad scientist's lab, art heist, tiki lounge, and our mobile escape room."};
    DocHead.addMeta(metaInfo);
});