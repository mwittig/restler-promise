/* jshint node:true, unused:true */
"use strict";

module.exports = function (Promise) {

    var restler = require('restler');

    var statusCodes = {
        401: 'Unauthorized (401)',
        403: 'Forbidden (403)',
        404: 'Not Found (404)',
        500: 'Internal Server Error (500)',
        501: 'Not Implemented (501)',
        502: 'Service Unavailable (502)'
    };

    function promiseWrapper(method) {
        return function() {
            var args = arguments;
            // the invocation takes place as part of the resolver function as the resolver function may be called
            // asynchronously (it is called synchronously with bluebird, though)
            return new Promise(function(resolve, reject) {
                var request = method.apply(restler, args);

                request.on('success', function(data, response) {
                    resolve({ data: data, response: response });
                });

                request.on('fail', function(data, response) {
                    reject({ error: new Error(statusCodes[response.statusCode] || 'Unknown'), response: response});
                });

                request.on('error', function(err, response) {
                    reject({ error: err, response: response});
                });

                request.on('timeout', function(ms) {
                    reject({ error: new Error("No response. Request timeout: " + ms + " ms"), response: null});
                });

                request.on('abort', function() {
                    reject({error: new Error('No response. Operation aborted'), response: null});
                });
            })
        };
    }

    var exports = ['get', 'post', 'put', 'del', 'head', 'json', 'postJson', 'putJson', 'patchJson'].reduce(function(exportObject, method) {
        var functionRef = restler[method];
        if (functionRef) {
            exportObject[method] = promiseWrapper(functionRef);
        }
        return exportObject;
    }, {});
    exports.restler = restler;
    return exports
};