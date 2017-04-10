"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getOwnPropertyNames = require("babel-runtime/core-js/object/get-own-property-names");

var _getOwnPropertyNames2 = _interopRequireDefault(_getOwnPropertyNames);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _freeze = require("babel-runtime/core-js/object/freeze");

var _freeze2 = _interopRequireDefault(_freeze);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialConfig = (0, _freeze2.default)({
    dbHost: "localhost",
    dbPort: 27017,
    dbName: "weblogjs",

    webProtocol: "http",
    webHost: "localhost",
    webPort: 8080,

    adminSiteStaticPaths: [],

    publicSiteStaticPaths: [],

    sessionSecret: "sdnIdjSe2AE2SADfD",

    adminEmail: "t@t.com",
    adminPassword: "tttttttt",
    adminDisplayName: "Admin",
    adminSlug: 'admin'
});

var config = (0, _assign2.default)({}, initialConfig);

Object.defineProperty(config, 'adminApiRoot', {
    get: function get() {
        return "/admin-api";
    }
});

/*
Object.defineProperty(config, 'adminSiteRoot', {
    get: () => "/admin"
});
*/

Object.defineProperty(config, 'publicApiRoot', {
    get: function get() {
        return "/public-api";
    }
});

/*
Object.defineProperty(config, 'publicSiteRoot', {
    get: () => "/"
});
*/

exports.default = (0, _freeze2.default)({

    setValues: function setValues(values) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(values)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var key = _step.value;

                if (config[key] !== undefined) {
                    config[key] = values[key];
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    },

    getValues: function getValues() {
        var obj = {};

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = (0, _getIterator3.default)((0, _getOwnPropertyNames2.default)(config)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var key = _step2.value;

                obj[key] = config[key];
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        return obj;
    },

    getValue: function getValue(key) {
        return config[key];
    }
});
module.exports = exports["default"];