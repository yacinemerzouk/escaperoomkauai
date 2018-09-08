var SquareConnect = require('square-connect');

Meteor.methods({

    saveCustomer({ reservation }) {

        // console.log'IN saveCustomer. Here is the data:');
        // console.logreservation.firstName);
        // console.logreservation.lastName);
        // console.logreservation.email);
        // console.logreservation.phone);
        // console.logreservation.publicId.toString());
        // console.logreservation.date+'@'+reservation.time);
        // console.logreservation.nonce);
        var defaultClient = SquareConnect.ApiClient.instance;

        // Configure OAuth2 access token for authorization: oauth2
        var oauth2 = defaultClient.authentications['oauth2'];
        oauth2.accessToken = Meteor.settings.private.square.accessToken;

        var apiInstance = new SquareConnect.CustomersApi();

        apiInstance.createCustomer({
            given_name: reservation.firstName,
            family_name: reservation.lastName,
            email_address: reservation.email,
            phone_number: reservation.phone,
            reference_id: reservation.publicId.toString(),
            note: reservation.date+'@'+reservation.time,
        }).then(function(createCustomerResponse) {
            // console.log'API called successfully. Returned data: ');
            // console.logcreateCustomerResponse.id);
            // console.logcreateCustomerResponse.customer.id);
            // console.logreservation.nonce);
            apiInstance.createCustomerCard(createCustomerResponse.customer.id, {
                card_nonce: reservation.nonce,
            }).then(function(data) {
                // console.log'API called successfully. Returned data: ' + data);
            }, function(error) {
                console.error(error);
            });
        }, function(error) {
            console.error(error);
        });


        // return customer;

        // var customer = apiInstance.createCustomer(body).then(function(data) {
        //     // console.log'API called successfully. Returned data: ' + data);
        // }, function(error) {
        //     console.error(error);
        // });
    },
    'squareTest': function () {

        var defaultClient = SquareConnect.ApiClient.instance;

        // Configure OAuth2 access token for authorization: oauth2
        var oauth2 = defaultClient.authentications['oauth2'];
        oauth2.accessToken = Meteor.settings.private.square.accessToken;

        var api = new SquareConnect.LocationsApi();

        // api.listLocations().then(function (data) {
        //     // console.log'API called successfully. Returned data: ' + data);
        //     return data;
        // }, function (error) {
        //     return error;
        // });

        var locations = api.listLocations();
        return locations;

    },

    'chargeTest': function(){

        var defaultClient = SquareConnect.ApiClient.instance;

        // Configure OAuth2 access token for authorization: oauth2
        var oauth2 = defaultClient.authentications['oauth2'];
        oauth2.accessToken = Meteor.settings.private.square.accessToken;

        var apiInstance = new SquareConnect.TransactionsApi();

        var locationId = "P98H4GRDXX614"; // String | The ID of the location to associate the created transaction with.

        var body = new SquareConnect.ChargeRequest({
            "idempotency_key": "TESTKEY1234",
            "card_nonce": "fake-card-nonce-ok",
            "reference_id": "RPCE#12345 ",
            "note": "Miscellaneous dog toys",
            "delay_capture": false,
            "shipping_address": {
                "address_line_1": "123 Main St",
                "locality": "San Francisco",
                "administrative_district_level_1": "CA",
                "postal_code": "94114",
                "country": "US"
            },
            "billing_address": {
                "address_line_1": "500 Electric Ave",
                "address_line_2": "Suite 600",
                "administrative_district_level_1": "NY",
                "locality": "New York",
                "postal_code": "10003",
                "country": "US"
            },
            "amount_money": {
                "amount": 5000,
                "currency": "USD"
            }
        }); // ChargeRequest | An object containing the fields to POST for the request.  See the corresponding object definition for field details.

        var charge = apiInstance.charge(locationId, body);
        return charge;

    },

});
