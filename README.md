# restler-promise

[![NPM Version](https://img.shields.io/npm/v/restler-promise.svg?style=flat)](https://www.npmjs.com/package/restler-promise) ![Node Version](https://img.shields.io/node/v/restler-promise.svg?style=flat) ![Downloads](https://img.shields.io/npm/dm/restler-promise.svg?style=flat) [![Build Status](https://travis-ci.org/mwittig/restler-promise.svg?branch=master)](https://travis-ci.org/mwittig/restler-promise)


A [restler](https://github.com/danwrong/restler) wrapper for the Promises/A+ implementation of your choice. 

```
    // You may need to install bluebird first
    var Promise = require("bluebird");
    var rest = require("restler-promise")(Promise);
    rest.get("http://google.com/").then(function (response) {
        console.log(response);
    }).catch(function (errorResult) {
        // Note, the errorResult is an object containing an "error" property holding
        // the Error object and an optional "response" property holding the the response
        // object (if any). The response object will be missing, for example, if there is
        // no response from server.
        console.log(errorResult);
    });
```
