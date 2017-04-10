'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseParameters = exports.errorHandler = exports.successHandler = exports.isLoggedOut = exports.isLoggedIn = exports.bypass = undefined;

var _isNan = require('babel-runtime/core-js/number/is-nan');

var _isNan2 = _interopRequireDefault(_isNan);

var _parseInt = require('babel-runtime/core-js/number/parse-int');

var _parseInt2 = _interopRequireDefault(_parseInt);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _errors = require('./errors');

var _url2 = require('url');

var _url3 = _interopRequireDefault(_url2);

var _simpleOdm = require('simple-odm');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bypass = exports.bypass = function bypass(request, response, next) {
    return next();
};

var isLoggedIn = exports.isLoggedIn = function isLoggedIn(request, response, next) {
    if (request.isAuthenticated()) return next();

    response.type('json').status(401).json({});
};

var isLoggedOut = exports.isLoggedOut = function isLoggedOut(request, response, next) {
    if (!request.isAuthenticated()) return next();

    response.type('json').status(401).json({});
};

var successHandler = exports.successHandler = function successHandler(response, obj) {
    var code = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;

    response.type('json').status(code).json(obj);
};

var errorHandler = exports.errorHandler = function errorHandler(response) {
    var code = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 400;

    return function (error) {

        if (error instanceof _simpleOdm.SimpleOdmValidationError) {
            response.type('json').status(code).json(error.message);
        } else {
            if (error && error.stack) console.error(error.stack);

            response.type('json').status(code).json(error);
        }
    };
};

var parseParameters = exports.parseParameters = function parseParameters(_url) {
    var obj = _url3.default.parse(_url, true);

    var params = (0, _assign2.default)({
        query: "{}",
        sort: "{}",
        limit: "0",
        skip: "0"
    }, obj.query);

    var query = void 0,
        sort = void 0,
        limit = void 0,
        skip = void 0;

    try {
        query = JSON.parse(params.query);

        if ((typeof query === 'undefined' ? 'undefined' : (0, _typeof3.default)(query)) !== "object") throw null;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(query)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var key = _step.value;

                var val = query[key];
                if (typeof val !== "string" && typeof val !== "number") {
                    throw null;
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
    } catch (error) {
        throw new _errors.SyntaxError("The query parameter is invalid.");
    }

    try {
        sort = JSON.parse(params.sort);

        if ((typeof sort === 'undefined' ? 'undefined' : (0, _typeof3.default)(sort)) !== "object") throw null;

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = (0, _getIterator3.default)((0, _keys2.default)(sort)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _key = _step2.value;

                var _val = sort[_key];
                if (_val !== 1 && _val !== -1) {
                    throw null;
                }
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
    } catch (error) {
        throw new _errors.SyntaxError("THe sort parameter is invalid.");
    }

    try {
        limit = (0, _parseInt2.default)(params.limit);
        if ((0, _isNan2.default)(limit)) throw null;
    } catch (error) {
        throw new _errors.SyntaxError("The limit parameter is invalid.");
    }

    try {
        skip = (0, _parseInt2.default)(params.skip);
        if ((0, _isNan2.default)(skip)) throw null;
    } catch (error) {
        throw new _errors.SyntaxError("The offset parameter is invalid.");
    }

    return { query: query, sort: sort, limit: limit, skip: skip };
};