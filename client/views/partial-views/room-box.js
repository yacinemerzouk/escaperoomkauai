Template.roomBox.helpers({
    dynamicSuccessRate: function(){

        var tmpl = this;

        Bolt.getSuccessRates();

        var successRates = Session.get('successRates');

        if( successRates && successRates[tmpl.room._id]){

           return successRates[tmpl.room._id].successRate;

        }else {
            return tmpl.room.successRate;
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