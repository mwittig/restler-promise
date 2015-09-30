module.exports = function (Promise) {

    var rest = require('restler');

    var statusCodes = {
        401: 'Unauthorized (401)',
        403: 'Forbidden (403)',
        404: 'Not Found (404)',
        500: 'Internal Server Error (500)',
        501: 'Not Implemented (501)',
        502: 'Service Unavailable (502)'
    };

    function defer() {
        var result = {};
        result.promise = new Promise(function(resolve, reject) {
            result.resolve = function(value) {
                resolve(value);
            };
            result.reject = function(value) {
                reject(value);
            };
        });
        return result
    }

    function wrapper(method) {
        return function() {
            var request = method.apply(rest, arguments),
                deferred = defer();

            request.on('success', function(data, response) {
                deferred.resolve({ data: data, response: response });
            });

            request.on('fail', function(data, response) {
                deferred.reject({ error: new Error(statusCodes[response.statusCode] || 'Unknown'), response: response});
            });

            request.on('error', function(err, response) {
                deferred.reject({ error: err, response: response});
            });

            request.on('timeout', function(ms) {
                deferred.reject({ error: new Error("No response. Request timeout: " + ms + " ms"), response: null});
            });

            request.on('abort', function() {
                deferred.reject({error: new Error('No response. Operation aborted'), response: null});
            });

            return deferred.promise
        };
    }

    return ['get', 'post', 'put', 'del', 'head', 'json', 'postJson', 'putJson', 'patchJson'].reduce(function(exportObject, method) {
        var functionRef = rest[method];
        if(functionRef) {
            exportObject[method] = wrapper(functionRef);
        }
        return exportObject;
    }, {});
};