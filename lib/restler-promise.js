/* jshint node:true, unused:true */
"use strict";

module.exports = function (Promise) {

    var restler = require('restler-base');

    var statusCodes = {
        400: 'Bad Request (400)',
        401: 'Unauthorized (401)',
        403: 'Forbidden (403)',
        404: 'Not Found (404)',
        405: 'Method Not Allowed (405)',
        406: 'Not Acceptable (406)',
        407: 'Proxy Authentication Required (407)',
        408: 'Request Timeout (408)',
        409: 'Conflict (409)',
        410: 'Gone - Requested Resource No Longer Available (409)',
        429: 'Too Many Requests (429)',
        500: 'Internal Server Error (500)',
        501: 'Not Implemented (501)',
        502: 'Bad Gateway (502)',
        503: 'Service Unavailable (503)',
        504: 'Gateway Timeout (504)'
    };

    function getStatusMessage(statusCode) {
        return statusCodes[statusCode] || 'Status (' + statusCode + ')'
    }

    function promiseWrapper(method) {
        return function() {
            var args = arguments;
            // the invocation takes place as part of the resolver function as the resolver function may be called
            // asynchronously (it is called synchronously with bluebird, though)
            return new Promise(function(resolve, reject) {
                var request = method.apply(restler, args);

                request.once('success', function(data, response) {
                    resolve({ data: data, response: response });
                });

                request.once('fail', function(data, response) {
                    reject({ error: new Error(getStatusMessage(response.statusCode)), response: response, data: data});
                });

                request.on('error', function(err, response) {
                    reject({ error: err, response: response});
                });

                request.once('timeout', function(ms) {
                    reject({ error: new Error("No response. Request timeout: " + ms + " ms"), response: null});
                });

                request.once('abort', function() {
                    reject({error: new Error('No response. Operation aborted'), response: null});
                });
            })
        };
    }

    var exports = ['get', 'post', 'put', 'del', 'head', 'json', 'postJson', 'putJson', 'patchJson', 'request'].reduce(function(exportObject, method) {
        var functionRef = restler[method];
        if (functionRef) {
            exportObject[method] = promiseWrapper(functionRef);
        }
        return exportObject;
    }, {});
    exports.restler = restler;
    return exports
};
