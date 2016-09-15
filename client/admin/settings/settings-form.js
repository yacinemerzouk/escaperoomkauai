Template.settingsForm.events({
    'submit [hook="update-settings"]': function(evt){
        evt.preventDefault();

        //Grab form data
        var formObject = $(evt.target);
        var formData = Bureaucrat.getFormData( formObject );

        //Get existing settings, populate, and update settings
        var setting = new Bolt.Setting(this._id);
        setting.populate(formData);
        setting.update();


        // Notify and reroute to admin dashboard
        if ( setting ){
            Notifications.success('Settings Updated', 'You have successfully updated the settings!');
            Router.go('admin');
        } else{
            Notifications.error( "Error", "The settings were NOT saved." );
        }
    }

});