'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (plainString, hashedString) {
    return new _promise2.default(function (resolve, reject) {
        _bcrypt2.default.compare(plainString, hashedString, function (error, isMatch) {
            if (error) return reject(error);
            resolve(isMatch);
        });
    });
};

module.exports = exports['default'];