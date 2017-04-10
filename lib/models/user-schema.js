'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _compareHashedStrings = require('../utilities/compare-hashed-strings');

var _compareHashedStrings2 = _interopRequireDefault(_compareHashedStrings);

var _generateHash = require('../utilities/generate-hash');

var _generateHash2 = _interopRequireDefault(_generateHash);

var _simpleOdm = require('simple-odm');

var _weblogjsSchema = require('./weblogjs-schema');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var paths = {

    email: {
        unique: true,
        required: true,
        type: _simpleOdm.types.String,
        sanitize: function sanitize(value) {
            return _validator2.default.normalizeEmail(value);
        },
        validate: _regenerator2.default.mark(function validate(value) {
            return _regenerator2.default.wrap(function validate$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            if (_validator2.default.isEmail(value)) {
                                _context.next = 3;
                                break;
                            }

                            _context.next = 3;
                            return 'A ' + this.name + ' should be a valid email.';

                        case 3:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, validate, this);
        })
    },

    password: {
        required: ['created'],
        type: _simpleOdm.types.String,
        projected: false,
        validate: _regenerator2.default.mark(function validate(value) {
            var range;
            return _regenerator2.default.wrap(function validate$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            range = { min: 8, max: 16 };

                            if (_validator2.default.isLength(value, range)) {
                                _context2.next = 4;
                                break;
                            }

                            _context2.next = 4;
                            return 'A ' + this.name + ' should be between ' + range.min + ' and ' + range.max + ' characters.';

                        case 4:
                            if (_validator2.default.matches(value, /^[a-zA-Z0-9#!@%&\*]*$/)) {
                                _context2.next = 7;
                                break;
                            }

                            _context2.next = 7;
                            return 'Only alphabets, numbers and some symbols (#, !, @, %, &, *) are allowed for a ' + this.name + '.';

                        case 7:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, validate, this);
        })
    },

    display_name: {
        display_name: "display name",
        required: true,
        type: _simpleOdm.types.String,
        sanitize: function sanitize(value) {
            return value.trim();
        },
        validate: _regenerator2.default.mark(function validate(value) {
            var range;
            return _regenerator2.default.wrap(function validate$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            range = { min: 1, max: 20 };

                            if (_validator2.default.isLength(value, range)) {
                                _context3.next = 4;
                                break;
                            }

                            _context3.next = 4;
                            return 'A ' + this.name + ' should be between ' + range.min + ' and ' + range.max + ' characters.';

                        case 4:
                            if (_validator2.default.matches(value, /^[a-zA-Z0-9_\-#!@%&\* ]*$/)) {
                                _context3.next = 7;
                                break;
                            }

                            _context3.next = 7;
                            return 'Only alphabets, numbers, spaces and some symbols (_, -, #, !, @, %, &, *) are allowed for a ' + this.name + '.';

                        case 7:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, validate, this);
        })
    },

    slug: {
        unique: true,
        required: true,
        type: _simpleOdm.types.String,
        sanitize: function sanitize(value) {
            return value.trim();
        },
        validate: _regenerator2.default.mark(function validate(value) {
            var range;
            return _regenerator2.default.wrap(function validate$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            range = { min: 1, max: 200 };

                            if (_validator2.default.isLength(value, range)) {
                                _context4.next = 4;
                                break;
                            }

                            _context4.next = 4;
                            return 'A ' + this.name + ' should be between ' + range.min + ' and ' + range.max + ' characters.';

                        case 4:
                            if (_validator2.default.matches(value, /^[a-zA-Z0-9\-_]*$/)) {
                                _context4.next = 7;
                                break;
                            }

                            _context4.next = 7;
                            return 'Only alphabets, numbers and some symbols (-, _) are allowed for a ' + this.name + '.';

                        case 7:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, validate, this);
        })
    }
};

var HASHED_PASSWORD = "hashed_password";
var OLD_PASSWORD = "old_password";
var PASSWORD_UPDATE = "password_update";
var PASSWORD = "password";
var PASSWORD_CONFIRMED = "password_confirmed";

var UserSchema = function (_WeblogJsSchema) {
    (0, _inherits3.default)(UserSchema, _WeblogJsSchema);

    /**
     * @override
     */
    function UserSchema() {
        (0, _classCallCheck3.default)(this, UserSchema);
        return (0, _possibleConstructorReturn3.default)(this, (UserSchema.__proto__ || (0, _getPrototypeOf2.default)(UserSchema)).call(this, { name: 'user', paths: paths }));
    }

    return UserSchema;
}(_weblogjsSchema.WeblogJsSchema);

var schema = new UserSchema();

_simpleOdm.eventHub.on(schema.BEFORE_SAVED, _weblogjsSchema.modifyDateData);

var onUpdate = function _callee(_ref) {
    var errors = _ref.errors,
        values = _ref.values,
        initialValues = _ref.initialValues;

    var _values, _errors, result;

    return _regenerator2.default.async(function _callee$(_context5) {
        while (1) {
            switch (_context5.prev = _context5.next) {
                case 0:
                    _values = (0, _assign2.default)({}, values);
                    _errors = (0, _assign2.default)({}, errors);


                    delete _values[PASSWORD];
                    delete _values[OLD_PASSWORD];
                    delete _values[PASSWORD_UPDATE];
                    delete _values[PASSWORD_CONFIRMED];

                    if (!values[PASSWORD_UPDATE]) {
                        _context5.next = 22;
                        break;
                    }

                    if (!values.hasOwnProperty(PASSWORD) || !values[PASSWORD]) {
                        _errors[PASSWORD] = ["The new password is required."];
                    }

                    if (!values.hasOwnProperty(OLD_PASSWORD) || !values[OLD_PASSWORD]) {
                        _errors[OLD_PASSWORD] = ["The current password is required."];
                    }

                    if (!values.hasOwnProperty(PASSWORD_CONFIRMED) || !values[PASSWORD_CONFIRMED]) {
                        _errors[PASSWORD_CONFIRMED] = ["The confirmed password is required."];
                    }

                    if (values.hasOwnProperty(PASSWORD_CONFIRMED) && values[PASSWORD_CONFIRMED] !== "" && values[PASSWORD] !== values[PASSWORD_CONFIRMED]) {
                        _errors[PASSWORD_CONFIRMED] = ['The confirmed password sent is not the same as the new password.'];
                    }

                    if (!(values.hasOwnProperty(OLD_PASSWORD) && values[OLD_PASSWORD] !== "")) {
                        _context5.next = 16;
                        break;
                    }

                    _context5.next = 14;
                    return _regenerator2.default.awrap((0, _compareHashedStrings2.default)(values[OLD_PASSWORD], initialValues[HASHED_PASSWORD]));

                case 14:
                    result = _context5.sent;

                    if (!result) {
                        _errors[OLD_PASSWORD] = ["The current password sent is not correct."];
                    }

                case 16:
                    if (!((0, _keys2.default)(_errors).length === 0)) {
                        _context5.next = 20;
                        break;
                    }

                    _context5.next = 19;
                    return _regenerator2.default.awrap((0, _generateHash2.default)(values[PASSWORD]));

                case 19:
                    _values[HASHED_PASSWORD] = _context5.sent;

                case 20:
                    _context5.next = 23;
                    break;

                case 22:
                    if (values.hasOwnProperty(PASSWORD) && values[PASSWORD]) {
                        _errors[PASSWORD] = ["The password can't be updated."];
                    }

                case 23:
                    return _context5.abrupt('return', {
                        values: _values,
                        errors: _errors
                    });

                case 24:
                case 'end':
                    return _context5.stop();
            }
        }
    }, null, undefined);
};

var onCreate = function _callee2(_ref2) {
    var errors = _ref2.errors,
        values = _ref2.values,
        initialValues = _ref2.initialValues;

    var _values;

    return _regenerator2.default.async(function _callee2$(_context6) {
        while (1) {
            switch (_context6.prev = _context6.next) {
                case 0:
                    _values = (0, _assign2.default)({}, values);


                    delete _values[PASSWORD];
                    delete _values[OLD_PASSWORD];
                    delete _values[PASSWORD_UPDATE];
                    delete _values[PASSWORD_CONFIRMED];

                    if (!(!errors[PASSWORD] || !Array.isArray(errors[PASSWORD]) || errors[PASSWORD].length === 0)) {
                        _context6.next = 9;
                        break;
                    }

                    _context6.next = 8;
                    return _regenerator2.default.awrap((0, _generateHash2.default)(values[PASSWORD]));

                case 8:
                    _values[HASHED_PASSWORD] = _context6.sent;

                case 9:
                    return _context6.abrupt('return', { values: _values });

                case 10:
                case 'end':
                    return _context6.stop();
            }
        }
    }, null, undefined);
};

_simpleOdm.eventHub.on(schema.BEFORE_SAVED, function (_ref3) {
    var errors = _ref3.errors,
        values = _ref3.values,
        initialValues = _ref3.initialValues;

    return !values._id ? onCreate({ errors: errors, values: values, initialValues: initialValues }) : onUpdate({ errors: errors, values: values, initialValues: initialValues });
});

exports.default = schema;
module.exports = exports['default'];