'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _simpleOdm = require('simple-odm');

var _userSchema = require('./user-schema');

var _userSchema2 = _interopRequireDefault(_userSchema);

var _compareHashedStrings = require('../utilities/compare-hashed-strings');

var _compareHashedStrings2 = _interopRequireDefault(_compareHashedStrings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('./setup-db-connection');

var UserModel = function (_MongoModel) {
    (0, _inherits3.default)(UserModel, _MongoModel);

    function UserModel() {
        (0, _classCallCheck3.default)(this, UserModel);
        return (0, _possibleConstructorReturn3.default)(this, (UserModel.__proto__ || (0, _getPrototypeOf2.default)(UserModel)).apply(this, arguments));
    }

    (0, _createClass3.default)(UserModel, [{
        key: 'checkPassword',
        value: function checkPassword(password) {
            return (0, _compareHashedStrings2.default)(password, this.values.hashed_password);
        }
    }], [{
        key: 'name',
        get: function get() {
            return _userSchema2.default.name;
        }
    }, {
        key: 'schema',
        get: function get() {
            return _userSchema2.default;
        }
    }]);
    return UserModel;
}(_simpleOdm.MongoModel);

exports.default = UserModel;
module.exports = exports['default'];