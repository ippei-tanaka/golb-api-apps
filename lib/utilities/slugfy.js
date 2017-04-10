"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (str) {
    return str.replace(/[^A-Za-z0-9 !@%\*\-_]/g, "").replace(/[ ]+/g, " ").trim().replace(/[ ]/g, "-").toLowerCase();
};

module.exports = exports["default"];