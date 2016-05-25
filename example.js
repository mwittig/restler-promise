// You may need to install bluebird first
var Promise = require("bluebird");
var rest = require("./index")(Promise);
rest.get("http://google.com/ssss").then(function (response) {
    console.log(response);
}).catch(function (errorResult) {
    // Note, the errorResult is an object containing an "error" property holding
    // the Error object and an optional "response" property holding the the response
    // object (if any). The response object will be missing, for example, if there is
    // no response from server.
    console.log(errorResult);
});