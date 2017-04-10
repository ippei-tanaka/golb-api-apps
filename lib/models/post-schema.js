'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _simpleOdm = require('simple-odm');

var _weblogjsSchema = require('./weblogjs-schema');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = new _weblogjsSchema.WeblogJsSchema({
    name: 'post', paths: {

        title: {
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
                                return 'A ' + this.displayName + ' should be between ' + range.min + ' and ' + range.max + ' characters.';

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
                                return 'A ' + this.displayName + ' should be between ' + range.min + ' and ' + range.max + ' characters.';

                            case 4:
                                if (_validator2.default.matches(value, /^[a-zA-Z0-9\-_]*$/)) {
                                    _context2.next = 7;
                                    break;
                                }

                                _context2.next = 7;
                                return 'Only alphabets, numbers and some symbols (-, _) are allowed for a ' + this.name + '.';

                            case 7:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, validate, this);
            })
        },

        content: {
            required: true,
            type: _simpleOdm.types.String,
            validate: _regenerator2.default.mark(function validate(value) {
                var range;
                return _regenerator2.default.wrap(function validate$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                range = { min: 1, max: 30000 };

                                if (_validator2.default.isLength(value, range)) {
                                    _context3.next = 4;
                                    break;
                                }

                                _context3.next = 4;
                                return 'A ' + this.displayName + ' should be between ' + range.min + ' and ' + range.max + ' characters.';

                            case 4:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, validate, this);
            })
        },

        author_id: {
            required: true,
            display_name: "author ID",
            type: _simpleOdm.types.MongoObjectID,
            validate: _regenerator2.default.mark(function validate(value) {
                return _regenerator2.default.wrap(function validate$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                if (!(value === null || value === undefined)) {
                                    _context4.next = 2;
                                    break;
                                }

                                return _context4.abrupt('return');

                            case 2:
                                if (value) {
                                    _context4.next = 5;
                                    break;
                                }

                                _context4.next = 5;
                                return '"' + value + '" is an invalid ID.';

                            case 5:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, validate, this);
            })
        },

        category_id: {
            display_name: "category ID",
            type: _simpleOdm.types.MongoObjectID,
            validate: _regenerator2.default.mark(function validate(value) {
                return _regenerator2.default.wrap(function validate$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                if (!(value === null || value === undefined)) {
                                    _context5.next = 2;
                                    break;
                                }

                                return _context5.abrupt('return');

                            case 2:
                                if (value) {
                                    _context5.next = 5;
                                    break;
                                }

                                _context5.next = 5;
                                return '"' + value + '" is an invalid ID.';

                            case 5:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, validate, this);
            })
        },

        tags: {
            type: [_simpleOdm.types.String],
            validate: _regenerator2.default.mark(function validate(value) {
                var range, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item;

                return _regenerator2.default.wrap(function validate$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                if (!(value === null || value === undefined)) {
                                    _context6.next = 2;
                                    break;
                                }

                                return _context6.abrupt('return');

                            case 2:
                                range = { min: 1, max: 100 };
                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context6.prev = 6;
                                _iterator = (0, _getIterator3.default)(value);

                            case 8:
                                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                    _context6.next = 16;
                                    break;
                                }

                                item = _step.value;

                                if (_validator2.default.isLength(item, range)) {
                                    _context6.next = 13;
                                    break;
                                }

                                _context6.next = 13;
                                return 'A tag should be between ' + range.min + ' and ' + range.max + ' characters.';

                            case 13:
                                _iteratorNormalCompletion = true;
                                _context6.next = 8;
                                break;

                            case 16:
                                _context6.next = 22;
                                break;

                            case 18:
                                _context6.prev = 18;
                                _context6.t0 = _context6['catch'](6);
                                _didIteratorError = true;
                                _iteratorError = _context6.t0;

                            case 22:
                                _context6.prev = 22;
                                _context6.prev = 23;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 25:
                                _context6.prev = 25;

                                if (!_didIteratorError) {
                                    _context6.next = 28;
                                    break;
                                }

                                throw _iteratorError;

                            case 28:
                                return _context6.finish(25);

                            case 29:
                                return _context6.finish(22);

                            case 30:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, validate, this, [[6, 18, 22, 30], [23,, 25, 29]]);
            })
        },

        published_date: {
            type: _simpleOdm.types.Date
        },

        is_draft: {
            type: _simpleOdm.types.Boolean
        }

    }
});

_simpleOdm.eventHub.on(schema.BEFORE_SAVED, _weblogjsSchema.modifyDateData);

exports.default = schema;
module.exports = exports['default'];