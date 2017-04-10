'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _simpleOdm = require('simple-odm');

var _weblogjsSchema = require('./weblogjs-schema');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = new _weblogjsSchema.WeblogJsSchema({

    name: 'category',

    paths: {

        name: {
            required: true,
            type: _simpleOdm.types.String,
            sanitize: function sanitize(value) {
                return value.trim();
            },
            validate: _regenerator2.default.mark(function validate(value) {
                var range;
                return _regenerator2.default.wrap(function validate$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                range = { min: 1, max: 200 };

                                if (_validator2.default.isLength(value, range)) {
                                    _context.next = 4;
                                    break;
                                }

                                _context.next = 4;
                                return 'A ' + this.name + ' should be between ' + range.min + ' and ' + range.max + ' characters.';

                            case 4:
                            case 'end':
                                return _context.stop();
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
                return _regenerator2.default.wrap(function validate$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                range = { min: 1, max: 200 };

                                if (_validator2.default.isLength(value, range)) {
                                    _context2.next = 4;
                                    break;
                                }

                                _context2.next = 4;
                                return 'A ' + this.name + ' should be between ' + range.min + ' and ' + range.max + ' characters.';

                            case 4:
                                if (_validator2.default.matches(value, /^[a-zA-Z0-9\-_]*$/)) {
                                    _context2.next = 7;
                                    break;
                                }

                                _context2.next = 7;
                                return 'Only alphabets, numbers and some symbols (-, _) are allowed for a ' + this.displayName + '.';

                            case 7:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, validate, this);
            })
        }
    }
});

_simpleOdm.eventHub.on(schema.BEFORE_SAVED, _weblogjsSchema.modifyDateData);

exports.default = schema;
module.exports = exports['default'];