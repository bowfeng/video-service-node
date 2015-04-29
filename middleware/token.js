var twilio = require('twilio');
var uuid = require('uuid');
var config = require('../config');

// Middleware function to add capability token and endpoint data to the 
// rendering context for a response
module.exports = function(request, response, next) {
    var data = {};

    // Generate a capability token for the client
    var capability = new twilio.Capability(config.accountSid, config.authToken);

    // Beta only - need this value for now, to be removed in a future
    // video release
    capability.allowClientOutgoing('AP00000000000000000000000000000000');

    // Create a unique ID for a video "endpoint" that identifies this
    // customer's browser window. Right now, just using a random string.
    // This will allow the customer to receive incoming video calls.
    var endpoint = uuid.v1();
    capability.allowClientIncoming(endpoint);

    // Add the capability token and endpoint ID to the rendering context
    response.locals.endpointId = endpoint;
    response.locals.token = capability.generate();
    next();
};