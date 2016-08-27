Template.game.helpers({
   game: function(){
       var game =  new Bolt.Game({
           date: this.date,
           time: this.time
       });
       return game;
   }
});

Template.game.events({
    'submit form': function(evt,tmpl){
        evt.preventDefault();
        Notifications.info('Sending message...');
        $('[type="submit"]').attr("disabled","disabled");
        var formData = Bureaucrat.getFormData($(evt.currentTarget));
        console.log('form data', formData);

        // Configure the Twilio client
        Meteor.call('sendSMS', formData.message, function(error,response){
            if( error ){
                console.log( error );
                Notifications.error( error.message );
            }else{
                console.log(response);
                var game = new Bolt.Game({
                    date: tmpl.data.date,
                    time: tmpl.data.time
                });
                if( !game.messages ){
                    game.messages = []
                }
                game.messages.push(response);
                game.save();
                $('textarea').val('');
                Notifications.success('Message sent');

            }
            $('[type="submit"]').removeAttr("disabled");

        })




    }
});