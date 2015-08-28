/* jshint node:true, unused:true */
"use strict";

module.exports = function(promise) {
    return require('./lib/restler-promise')(promise);
};