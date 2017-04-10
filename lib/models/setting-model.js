'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _simpleOdm = require('simple-odm');

var _settingSchema = require('./setting-schema');

var _settingSchema2 = _interopRequireDefault(_settingSchema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('./setup-db-connection');

var SettingModel = function (_MongoModel) {
    (0, _inherits3.default)(SettingModel, _MongoModel);

    function SettingModel() {
        (0, _classCallCheck3.default)(this, SettingModel);
        return (0, _possibleConstructorReturn3.default)(this, (SettingModel.__proto__ || (0, _getPrototypeOf2.default)(SettingModel)).apply(this, arguments));
    }

    (0, _createClass3.default)(SettingModel, null, [{
        key: 'findMany',
        value: function findMany() {
            return undefined;
        }
    }, {
        key: 'findOne',
        value: function findOne() {
            return undefined;
        }
    }, {
        key: 'getSetting',
        value: function getSetting() {
            var findOne = (0, _get3.default)(SettingModel.__proto__ || (0, _getPrototypeOf2.default)(SettingModel), 'findOne', this).bind(this);

            return (0, _co2.default)(_regenerator2.default.mark(function _callee() {
                var model;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return findOne();

                            case 2:
                                model = _context.sent;

                                if (!model) {
                                    _context.next = 7;
                                    break;
                                }

                                return _context.abrupt('return', model);

                            case 7:
                                _context.next = 9;
                                return this.setSetting({});

                            case 9:
                                _context.next = 11;
                                return findOne();

                            case 11:
                                return _context.abrupt('return', _context.sent);

                            case 12:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }).bind(this));
        }
    }, {
        key: 'setSetting',
        value: function setSetting(values) {
            var findOne = (0, _get3.default)(SettingModel.__proto__ || (0, _getPrototypeOf2.default)(SettingModel), 'findOne', this).bind(this);

            return (0, _co2.default)(_regenerator2.default.mark(function _callee2() {
                var model;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return findOne();

                            case 2:
                                model = _context2.sent;

                                if (!model) {
                                    _context2.next = 9;
                                    break;
                                }

                                (0, _assign2.default)(model.values, values);
                                _context2.next = 7;
                                return model.save();

                            case 7:
                                _context2.next = 12;
                                break;

                            case 9:
                                model = new this(values);
                                _context2.next = 12;
                                return model.save();

                            case 12:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }).bind(this));
        }
    }, {
        key: 'name',
        get: function get() {
            return _settingSchema2.default.name;
        }
    }, {
        key: 'schema',
        get: function get() {
            return _settingSchema2.default;
        }
    }]);
    return SettingModel;
}(_simpleOdm.MongoModel);

exports.default = SettingModel;
module.exports = exports['default'];