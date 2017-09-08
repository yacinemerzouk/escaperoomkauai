Template.roomBox.helpers({
    dynamicSuccessRate: function(){

        var tmpl = this;

        Bolt.getSuccessRates();

        var successRates = Session.get('successRates');

        if( successRates ){
            return successRates[tmpl.room._id].successRate;
        }else {
            return false;
        }

    },
    showOpeningDate: function(){
        var today = Epoch.dateObjectToDateString( new Date() );
        // console.log( this.room, today );
        if( this.room.openingDate > today ){
            return true
        }else{
            return false
        }
    }
});