'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SALT_WORK_FACTOR = 10;

exports.default = function (str) {
    return new _promise2.default(function (resolve, reject) {
        _bcrypt2.default.genSalt(SALT_WORK_FACTOR, function (error, salt) {
            if (error) return reject(error);

            _bcrypt2.default.hash(str, salt, function (error, hash) {
                if (error) return reject(error);
                resolve(hash);
            });
        });
    });
};

module.exports = exports['default'];