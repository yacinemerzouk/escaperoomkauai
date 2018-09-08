// // Set the application ID
// var applicationId = "sandbox-sq0idp-4N53WNWUbW5bG31FcixUzQ";
//
// // Set the location ID
// var locationId = "CBASEI_ZMZ8-PkhHOODo-3LNY-kgAQ";
//
// /*
//  * function: requestCardNonce
//  *
//  * requestCardNonce is triggered when the "Pay with credit card" button is
//  * clicked
//  *
//  * Modifying this function is not required, but can be customized if you
//  * wish to take additional action when the form button is clicked.
//  */
// function requestCardNonce(event) {
//
//     // Don't submit the form until SqPaymentForm returns with a nonce
//     event.preventDefault();
//
//     // Request a nonce from the SqPaymentForm object
//     paymentForm.requestCardNonce();
// }
//
// // Create and initialize a payment form object
// var paymentForm = new SqPaymentForm({
//
//     // Initialize the payment form elements
//     applicationId: applicationId,
//     locationId: locationId,
//     inputClass: 'sq-input',
//
//     // Customize the CSS for SqPaymentForm iframe elements
//     inputStyles: [{
//         fontSize: '.9em'
//     }],
//
//     // Initialize Apple Pay placeholder ID
//     applePay: {
//         elementId: 'sq-apple-pay'
//     },
//
//     // Initialize Masterpass placeholder ID
//     masterpass: {
//         elementId: 'sq-masterpass'
//     },
//
//     // Initialize the credit card placeholders
//     cardNumber: {
//         elementId: 'sq-card-number',
//         placeholder: '•••• •••• •••• ••••'
//     },
//     cvv: {
//         elementId: 'sq-cvv',
//         placeholder: 'CVV'
//     },
//     expirationDate: {
//         elementId: 'sq-expiration-date',
//         placeholder: 'MM/YY'
//     },
//     postalCode: {
//         elementId: 'sq-postal-code'
//     },
//
//     // SqPaymentForm callback functions
//     callbacks: {
//
//         /*
//          * callback function: methodsSupported
//          * Triggered when: the page is loaded.
//          */
//         methodsSupported: function (methods) {
//
//             var applePayBtn = document.getElementById('sq-apple-pay');
//             var applePayLabel = document.getElementById('sq-apple-pay-label');
//             var masterpassBtn = document.getElementById('sq-masterpass');
//             var masterpassLabel = document.getElementById('sq-masterpass-label');
//
//             // Only show the button if Apple Pay for Web is enabled
//             // Otherwise, display the wallet not enabled message.
//             if (methods.applePay === true) {
//                 applePayBtn.style.display = 'inline-block';
//                 applePayLabel.style.display = 'none' ;
//             }
//             // Only show the button if Masterpass is enabled
//             // Otherwise, display the wallet not enabled message.
//             if (methods.masterpass === true) {
//                 masterpassBtn.style.display = 'inline-block';
//                 masterpassLabel.style.display = 'none';
//             }
//         },
//
//         /*
//          * callback function: createPaymentRequest
//          * Triggered when: a digital wallet payment button is clicked.
//          */
//         createPaymentRequest: function () {
//
//             var paymentRequestJson ;
//             /* ADD CODE TO SET/CREATE paymentRequestJson */
//             return paymentRequestJson ;
//         },
//
//         /*
//          * callback function: validateShippingContact
//          * Triggered when: a shipping address is selected/changed in a digital
//          *                 wallet UI that supports address selection.
//          */
//         validateShippingContact: function (contact) {
//
//             var validationErrorObj ;
//             /* ADD CODE TO SET validationErrorObj IF ERRORS ARE FOUND */
//             return validationErrorObj ;
//         },
//
//         /*
//          * callback function: cardNonceResponseReceived
//          * Triggered when: SqPaymentForm completes a card nonce request
//          */
//         cardNonceResponseReceived: function(errors, nonce, cardData, billingContact, shippingContact) {
//             if (errors) {
//                 // Log errors from nonce generation to the Javascript console
//                 console.log("Encountered errors:");
//                 errors.forEach(function(error) {
//                     console.log('  ' + error.message);
//                 });
//
//                 return;
//             }
//
//             console.log('Nonce received: ' + nonce); /* FOR TESTING ONLY */
//
//             // Assign the nonce value to the hidden form field
//             document.getElementById('card-nonce').value = nonce;
//
//             // POST the nonce form to the payment processing page
//             document.getElementById('nonce-form').submit();
//
//         },
//
//         /*
//          * callback function: unsupportedBrowserDetected
//          * Triggered when: the page loads and an unsupported browser is detected
//          */
//         unsupportedBrowserDetected: function() {
//             /* PROVIDE FEEDBACK TO SITE VISITORS */
//         },
//
//         /*
//          * callback function: inputEventReceived
//          * Triggered when: visitors interact with SqPaymentForm iframe elements.
//          */
//         inputEventReceived: function(inputEvent) {
//             switch (inputEvent.eventType) {
//                 case 'focusClassAdded':
//                     /* HANDLE AS DESIRED */
//                     break;
//                 case 'focusClassRemoved':
//                     /* HANDLE AS DESIRED */
//                     break;
//                 case 'errorClassAdded':
//                     /* HANDLE AS DESIRED */
//                     break;
//                 case 'errorClassRemoved':
//                     /* HANDLE AS DESIRED */
//                     break;
//                 case 'cardBrandChanged':
//                     /* HANDLE AS DESIRED */
//                     break;
//                 case 'postalCodeChanged':
//                     /* HANDLE AS DESIRED */
//                     break;
//             }
//         },
//
//         /*
//          * callback function: paymentFormLoaded
//          * Triggered when: SqPaymentForm is fully loaded
//          */
//         paymentFormLoaded: function() {
//             /* HANDLE AS DESIRED */
//         }
//     }
// });
