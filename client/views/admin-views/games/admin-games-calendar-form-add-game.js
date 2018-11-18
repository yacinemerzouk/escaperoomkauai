Template.calendarFormAddGame.events({
    'click [hook="calendar-form-background"]': function(evt,tmpl){
        Blaze.remove(tmpl.view);
    },
    'click [hook="calendar-form-close"]': function(evt,tmpl){
        Blaze.remove(tmpl.view);
    },
    'click [hook="issue-refund"]': function(evt,tmpl){
        evt.preventDefault();
        var publicId = $(evt.currentTarget).attr('hook-data-reservation-public-id');
    },
    'submit form': function(evt,tmpl){
        evt.preventDefault();
        var formData = Bureaucrat.getFormData( $(evt.target) );
        if(formData.time === "0"){
            Notifications.error("Select time before saving...");
        }else {
            // console.log( formData );
            Bolt.Collections.Games.insert(formData);
            Blaze.remove(tmpl.view);
            Notifications.success('Game Created');
        }
    }
});
Template.calendarFormAddGame.helpers({
    allTimes: function(){
        return Bolt.getAdminStartTimes();
    },
    rooms: function(){
        return Bolt.Collections.Rooms.find({available:true});
    },
    gameMasters: function(){
        return Meteor.users.find({});
    }
});
